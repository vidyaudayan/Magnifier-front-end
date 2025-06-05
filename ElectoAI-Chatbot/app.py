from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import re
import uuid
import os
from google.cloud import storage
from rapidfuzz import process, fuzz
import requests
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from dotenv import load_dotenv
from pymongo import MongoClient
import google.generativeai as genai
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # or WARNING/ERROR depending on verbosity you want
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment
load_dotenv()

# Flask setup
app = Flask(__name__)
CORS(app)

# Environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
MONGO_URI = os.getenv("MONGO_URI")
# URLs stored in environment variables
NEWS_URL = os.getenv("NEWS_JSON_URL")
ELECTION_URL = os.getenv("ELECTION_JSON_URL")

# Check environment setup
if not all([PINECONE_API_KEY, PINECONE_INDEX_NAME, MONGO_URI, NEWS_URL, ELECTION_URL]):
    raise RuntimeError("Missing one or more required environment variables.")

# MongoDB setup
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["electoai"]
chat_collection = db["chat_history"]

# Services init

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # assumes it's set in your env
genai.configure(api_key=GOOGLE_API_KEY)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
question_gemini = genai.GenerativeModel("gemini-1.5-flash")
answer_gemini = genai.GenerativeModel("gemini-2.0-flash")


MAX_HISTORY = 5

# Load GCS data
# Utility to load public JSON from a URL
def load_public_json_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"❌ Error loading from URL {url}: {e}")
        return []

# Load data from public URLs
news_data = load_public_json_from_url(NEWS_URL)
election_data = load_public_json_from_url(ELECTION_URL)

# Utility
def normalize(text):
    return text.lower()

def is_topic_match(topics, text):
    return any(topic.lower() in text for topic in topics)

def generate_embedding(text):
    return embedding_model.encode(text).tolist()

# MongoDB chat history functions
def get_chat_history(username):
    doc = chat_collection.find_one({"username": username})
    return doc["history"] if doc else []

def update_chat_history(username, question, answer):
    history = get_chat_history(username)
    history.append({"question": question, "answer": answer})
    if len(history) > MAX_HISTORY:
        history = history[-MAX_HISTORY:]
    chat_collection.update_one(
        {"username": username},
        {"$set": {"history": history}},
        upsert=True
    )

# Query Parsing
def parse_query_with_gemini(query, history, user_state):
    today = datetime.today().strftime("%Y-%m-%d")
    past_question = "\n".join([f"Q: {item['question']}" for item in history])
    prompt = f"""
    Today's date is {today}.
    Use the past questions for context:
    {past_question}
    - if just news or party mentioned use user state: {user_state} (dont use with *topics*)

    From the following query, extract:
    1. keys (like bihar, delhi, west bengal, BJP_Bihar, Delhi, AITC_West Bengal, Never mind if it is uppercase or lower case),
    - Never use anything other than party/state as key
    - either state or party_state (not party alone)
    2. topics (like Sita temple, Amit Shah), (use the entire question for topic)
    3. date_range: ["YYYY-MM-DD", "YYYY-MM-DD"]
    - recent/latest etc.. use nearest 4 days

    If election results are asked, extract:
    - constituency: [list of constituency names]
    - year: [list of years]

    Return only JSON:
    {{
      "keys": [...],
      "topics": [...],
      "date_range": ["YYYY-MM-DD", "YYYY-MM-DD"],
      "constituency": [...],
      "year": [...]
    }}

    Query: "{query}"
    """

    res = question_gemini.generate_content(prompt)

    try:
        match = re.search(r'\{.*\}', res.text, re.DOTALL)
        if not match:
            raise ValueError("No JSON object found in the response.")
        json_text = match.group(0)
        return json.loads(json_text)
    except Exception as e:
        logger.error("\u274c JSON parse error:", e)
        return None

# Answer Generator
def answer_with_gemini(user_query, results, history):
    history_text = "\n".join([f"Q: {item['question']}\nA: {item['answer']}" for item in history])
    prompt = f"""
    You are a indian political assistant.
    Your name is ElectoAI

    Follow these rules:
    1. Use the 'Results' provided to generate the most relevant answer.
    2. If 'Results' are empty or irrelevant, then refer to the 'Past Conversation'.
    3. If both 'Results' and 'Past Conversation' don't help, use your own general knowledge ONLY for factual questions 
       (e.g. "Who is the PM of India?", "Which party is Rahul Gandhi from?").
    4. For casual messages (e.g., "hi", "hello"), respond in a friendly tone.
    5. If you can’t find any info, politely mention it.

    ---

    Past Conversation:
    {history_text}

    User Question:
    "{user_query}"

    Results (retrieved knowledge base):
    {json.dumps(results, indent=2, ensure_ascii=False)}

    ---

    Reply to the user accordingly:
    """
    res = answer_gemini.generate_content(prompt)
    return res.text.strip()

# Search Handlers
def search_by_key_and_date(data, keys, date_range, topics):
    try:
        start_date = datetime.strptime(date_range[0], "%Y-%m-%d")
        end_date = datetime.strptime(date_range[1], "%Y-%m-%d")
        matches = []
        for row in data:
            row_key = row['key'].strip().lower()
            row_date = datetime.strptime(row['date'], "%Y-%m-%d")
            combined = normalize(f"{row['trending_headlines']} {row['summary']}")
            if start_date <= row_date <= end_date and any(k.lower() == row_key for k in keys):
                if not topics or is_topic_match(topics, combined):
                    matches.append((row, row_date))
        matches.sort(key=lambda x: x[1], reverse=True)
        return [r[0] for r in matches[:10]]
    except Exception as e:
        logger.error("\u274c Error in search_by_key_and_date:", e)
        return []

def topic_search_pinecone(topics, top_k=10):
    try:
        query = " ".join(topics)
        embedding = generate_embedding(query)
        res = index.query(vector=embedding, top_k=top_k, include_metadata=True)
        sorted_matches = sorted(res.get("matches", []), key=lambda m: m['metadata'].get("date", ""), reverse=True)
        return [
            {
                "date": m['metadata']['date'],
                "key": m['metadata']['key'],
                "state": m['metadata'].get("state", ""),
                "trending_headlines": m['metadata']['trending_headlines'],
                "summary": m['metadata']['summary']
            } for m in sorted_matches
        ]
    except Exception as e:
        logger.error("\u274c Pinecone search error:", e)
        return []

def fetch_data_by_multiple_years_constituencies(data, year, constituency_query):
    try:
        names = list({row["constituency"] for row in data})
        match = process.extractOne(constituency_query, names, scorer=fuzz.ratio)
        if match and match[1] >= 80:
            best = match[0]
            return [row for row in data if row["year"] == int(year) and row["constituency"] == best], best
        return [], constituency_query
    except Exception as e:
        logger.error("\u274c Constituency match error:", e)
        return [], constituency_query

def search_election_results(data, constituencies, years):
    output = []
    for const in constituencies:
        for yr in years:
            res, matched = fetch_data_by_multiple_years_constituencies(data, yr, const)
            if res:
                output.append({
                    "constituency": matched,
                    "year": yr,
                    "candidates": res
                })
    return output

def search_data(query, chat_history, user_state):
    parsed = parse_query_with_gemini(query, chat_history, user_state)
    if not parsed:
        return None, None

    keys = parsed.get("keys", [])
    topics = parsed.get("topics", [])
    date_range = parsed.get("date_range", [])
    constituencies = parsed.get("constituency", [])
    years = parsed.get("year", [])

    # 🛑 Enforce rule: if keys are used, discard topics
    if keys:
        topics = []

    if constituencies or years:
        return search_election_results(election_data, constituencies, years), "election"
    elif keys and len(date_range) == 2:
        return search_by_key_and_date(news_data, keys, date_range, topics), "news"
    elif topics:
        return topic_search_pinecone(topics), "topic_search"

    return None, None

# API Route
@app.route('/api/gemini', methods=['POST'])
def generate_from_gemini():
    try:
        data = request.get_json()
        user_query = data.get('input', '')
        user_state = data.get("state")
        username = data.get("username")
        session_id = data.get("session_id") or str(uuid.uuid4())

        # Load chat history from MongoDB
        chat_history = get_chat_history(username)

        # Run query
        search_results, result_type = search_data(user_query, chat_history, user_state)
        answer = answer_with_gemini(user_query, search_results, chat_history)

        # Format answer
        full_answer = answer if result_type != "election" else answer + "\n\nElection Results:\n" + json.dumps(search_results, indent=2, ensure_ascii=False)

        # Update chat history in MongoDB
        update_chat_history(username, user_query, full_answer)

        return jsonify({
            'output': answer,
            'search_results': search_results if result_type == "election" else None,
            'session_id': session_id
        })

    except Exception as e:
        print("\u274c API error:", e)
        return jsonify({'error': 'Something went wrong'}), 500

# Health check
@app.route('/', methods=['GET'])
def running_status():
    return "ElectoAI Gemini Backend is running with MongoDB!"

if __name__ == '__main__':
    app.run(debug=True, port=5000,  use_reloader=False)