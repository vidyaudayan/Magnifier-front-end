import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Menu } from 'lucide-react';
import { ChatData } from '../context/ChatContex';
import ReactMarkdown from "react-markdown";

function ElectoAI() {
  const {
    fetchResponse,
    messages,
    setMessages,
    prompt,
    setPrompt,
    newRequestLoading,
  } = ChatData();

  const messageRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResponse();
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Header - Fixed */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 bg-white dark:bg-gray-800 flex-none">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center ml-4">
          <Bot className="w-8 h-8 text-blue-600" />
          <div className="ml-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">ElectoAI ChatBot</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Magnifier</p>
          </div>
        </div>
      </header>

      {/* Message Container - Scrollable */}
      <div
        ref={messageRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gray-50 dark:bg-gray-900"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-400">
            <Bot className="w-12 h-12" />
            <p>How can I assist you today?</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-6">
            {/* User message */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                <p className="text-sm font-normal">{message.question}</p>
              </div>
            </div>

            {/* Bot message */}
            <div className="flex items-start gap-3">
              <div className="px-4 py-2 rounded-2xl rounded-tl-sm max-w-[80%] text-sm text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-800">
                <ReactMarkdown>{message.answer}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {newRequestLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-sm">Thinking</span>
          </div>
        )}
      </div>

      {/* Input - Fixed */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 flex-none">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Message ElectoAI..."
              className="w-full p-4 pr-12 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 dark:text-gray-300 hover:text-blue-600"
            >
              <Send className="w-7 h-7 text-blue-700 dark:text-blue-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ElectoAI;
