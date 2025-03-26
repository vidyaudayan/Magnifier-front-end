import { useState } from "react";
import NavbarWelcome from "./NavbarWelcome";

const faqs = [
  {
    question: "What is Magnifier, and how does it work?",
    answer: "Magnifier is a platform that transforms grassroots political discussions into actionable insights. It operates through three platforms – Web Magnifier (a political discussion platform with monetization), Voter Magnifier (booth-level voter insights), and Media Magnifier (voter analytics for media and organizations).",
  },
  {
    question: "How can I join Web Magnifier?",
    answer: "You can sign up directly on the Web Magnifier platform. If you already have an account, simply log in and start participating in discussions.",
  },
  {
    question: "How does the post verification process work?",
    answer: "All posts made on Web Magnifier go through expert review to ensure they align with platform guidelines, social media norms, and legal standards. This helps us maintain a respectful and hate-free environment.",
  },
  {
    question: "Can I earn money on Web Magnifier?",
    answer: "Yes! Users will earn money based on the engagement and each reaction (like or dislike) they receive. Earnings per Reaction – ₹10 for each reaction. Earnings policies may change based on platform policies.",
  },
  {
    question: "What is Voter Magnifier used for?",
    answer: "Voter Magnifier provides booth-wise voter insights and analytics for political parties and strategists. This helps in creating data-driven campaigns and understanding key voter demographics.",
  },
  {
    question: "How can I subscribe to Voter Magnifier or Media Magnifier?",
    answer: "Both operate on a subscription basis. Fill out the Contact Us form with your details, and our team will guide you through the process.",
  },
  {
    question: "What kind of identity proof is required for subscription?",
    answer: "We accept government-issued IDs such as organization’s ID card, or political party membership cards. This helps us ensure authenticity and secure access to sensitive voter data.",
  },
  {
    question: "How long does it take to process my subscription request?",
    answer: "Subscription requests typically take 24-48 business hours for review and verification. Our team will contact you if additional information is needed.",
  },
  {
    question: "Is my data secure on Magnifier?",
    answer: "Absolutely. We prioritize user privacy and ensure that all submitted data is kept confidential and used solely for verification and communication purposes.",
  },
  {
    question: "Who can use Media Magnifier?",
    answer: "Media Magnifier is designed for media houses, political analysts, and organizations looking for in-depth voter insights. It's available through a subscription model.",
  },
  {
    question: "How can I contact support for further questions?",
    answer: "You can reach out to us directly via the Contact Us page, email, or by calling our support team. We’re happy to assist with any inquiries.",
  },
  {
    question: "How can I withdraw my earnings from Web Magnifier?",
    answer: "Minimum Withdrawal – ₹100 initially, withdraw any amount after one month. Withdrawal Methods – Bank transfer, UPI, or linked payment wallets. Processing Time – 3-7 business days.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white ">
     <NavbarWelcome/>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-2 mt-20 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4 transition-all duration-300"
            >
              <button
                className="w-full flex justify-between items-center py-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-800">
                  {faq.question}
                </span>
                <span className="text-xl text-blue-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 pt-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
