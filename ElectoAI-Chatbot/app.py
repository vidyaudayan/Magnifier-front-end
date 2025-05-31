# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import uuid
# import os
# import google.generativeai as genai
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()
# API_KEY = os.getenv("GOOGLE_API_KEY")

# # Configure Gemini
# genai.configure(api_key=API_KEY)
# model = genai.GenerativeModel("gemini-2.0-flash")

# app = Flask(__name__)
# CORS(app)

# # In-memory chat storage (optional)
# chats = []

# # 🎯 Create a new chat
# @app.route("/api/chat/new", methods=["POST"])
# def create_chat():
#     chat_id = str(uuid.uuid4())
#     chat = {
#         "_id": chat_id,
#         "latestMessage": "New chat created"
#     }
#     chats.append(chat)
#     return jsonify(chat), 201

# # 🤖 Generate response from Gemini
# @app.route('/api/gemini', methods=['POST'])
# def gemini_chat():
#     user_input = request.json.get("input")
#     username = request.json.get("username")
#     state = request.json.get("state")

#     if not user_input:
#         return jsonify({"error": "No input provided"}), 400

#     try:
#         # Log user info (optional)
#         print(f"[{username} from {state}] Prompt: {user_input}")

#         # Generate Gemini response
#         response = model.generate_content(user_input)
#         reply = response.text

#         return jsonify({"output": reply})
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500

# # Health check route
# @app.route("/", methods=["GET"])
# def index():
#     return "Gemini Chatbot Backend is running"

# if __name__ == "__main__":
#     app.run(debug=True)




from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import re
import uuid
import os
import time
from collections import defaultdict
from google.cloud import storage
from rapidfuzz import process, fuzz
from vertexai.preview.generative_models import GenerativeModel
import vertexai
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from dotenv import load_dotenv

# Load environment
load_dotenv()

# Flask setup
app = Flask(__name__)
CORS(app)

# Environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PROJECT_ID = os.getenv("PROJECT_ID")
LOCATION = os.getenv("LOCATION")

# Check environment setup
if not all([PINECONE_API_KEY, PINECONE_INDEX_NAME, PROJECT_ID, LOCATION]):
    raise RuntimeError("Missing one or more required environment variables.")

# Services init
client = storage.Client()
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)
vertexai.init(project=PROJECT_ID, location=LOCATION)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
gemini = GenerativeModel("gemini-2.0-flash-001")

# Session memory
user_sessions = defaultdict(lambda: {"history": [], "last_active": time.time()})
MAX_HISTORY = 5
SESSION_TIMEOUT = 3600  # 1 hour

# Load GCS data
def load_json_from_bucket(bucket_name, file_name):
    try:
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(file_name)
        return json.loads(blob.download_as_text())
    except Exception as e:
        print(f"❌ Error loading file {file_name}: {e}")
        return []

news_data = load_json_from_bucket("electoai-bucket", "daily_summary.json")
election_data = load_json_from_bucket("electoai-bucket", "election_data.json")

# Utility
def normalize(text):
    return text.lower()

def is_topic_match(topics, text):
    return any(topic.lower() in text for topic in topics)

def generate_embedding(text):
    return embedding_model.encode(text).tolist()

# Query Parsing
def parse_query_with_gemini(query, history, user_state):
    today = datetime.today().strftime("%Y-%m-%d")
    past_question = "\n".join([f"Q: {item['question']}" for item in history])
    prompt = f"""
    Today's date is {today}.
    Use the past questions for context:
    {past_question}
    - if just news or party mentioned use user state: {user_state} (dont use with topics)

    From the following query, extract:
    1. keys (like bihar, delhi, west bengal, BJP_Bihar, Delhi, AITC_West Bengal, Never mind if it is uppercase or lower case),
    - Never use anything other than party/state as key
    2. topics (like Sita temple, Amit Shah),
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
    res = gemini.generate_content(prompt)
    print("🔍 Gemini parse raw output:", res.text)
    try:
        json_text = re.sub(r"json|", "", res.text).strip()
        return json.loads(json_text)
    except Exception as e:
        print("❌ JSON parse error:", e)
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
    res = gemini.generate_content(prompt)
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
        print("❌ Error in search_by_key_and_date:", e)
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
        print("❌ Pinecone search error:", e)
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
        print("❌ Constituency match error:", e)
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
        username = request.json.get("username")
        user_state = request.json.get("state")
        print(f"🧑 User: {username}, 📍 State: {user_state}")

        if not username:
            return jsonify({'error': 'Missing user_id'}), 400

        # Session cleanup
        current_time = time.time()
        for uid in list(user_sessions.keys()):
            if current_time - user_sessions[uid]["last_active"] > SESSION_TIMEOUT:
                del user_sessions[uid]

        # Get session
        session = user_sessions[username]
        chat_history = session["history"]
        session["last_active"] = current_time

        # Run query
        search_results, result_type = search_data(user_query, chat_history, user_state)
        answer = answer_with_gemini(user_query, search_results, chat_history)

        # Store
        chat_history.append({
            "question": user_query,
            "answer": {"text": answer if result_type != "election" else answer + "\n\nElection Results:\n" + json.dumps(search_results, indent=2, ensure_ascii=False)}
        })
        if len(chat_history) > MAX_HISTORY:
            chat_history.pop(0)

        return jsonify({
            'output': answer,
            'search_results': search_results if result_type == "election" else None
        })
    except Exception as e:
        print("❌ API error:", e)
        return jsonify({'error': 'Something went wrong'}), 500

# Health check
@app.route('/', methods=['GET'])
def running_status():
    return "ElectoAI Gemini Backend is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)


print("HEllo World")