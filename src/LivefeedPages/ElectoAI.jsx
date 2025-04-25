

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Menu, Plus, Settings, History, HelpCircle, Share2, MoreVertical, ThumbsUp, ThumbsDown, RefreshCw, X } from 'lucide-react';

function ElectoAI() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    // Add bot response
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: "Hi there! How can I help you today?",
      sender: 'bot',
    };

    setMessages([...messages, userMessage, botMessage]);
    setInputValue('');
  };

  return (
    <div className="flex h-screen bg-gray-50 lg:mt-2 mt-4">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:relative w-80 bg-white border-r border-gray-200 h-full flex flex-col z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 mb-6 w-full">
            <Plus className="w-5 h-5" />
            <span>New chat</span>
          </button>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Recent</h2>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700">
                Previous Chat 1
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700">
                Previous Chat 2
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700 w-full">
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700 w-full">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center px-4 bg-white">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center ml-4">
            <Bot className="w-6 h-6 text-blue-600" />
            <div className="ml-2">
              <h1 className="text-xl font-semibold">ElectoAI</h1>
              <p className="text-xs text-gray-500">Powered by Magnifier</p>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'user' ? (
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%] md:max-w-2xl break-words">
                  {message.text}
                </div>
              ) : (
                <div className="max-w-[85%] md:max-w-2xl">
                  <div className="text-gray-900">
                    {message.text}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-gray-500">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message ElectoAI..."
                className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ElectoAI