import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { getAi, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Content } from '@google/genai';
import { useLanguage } from '../context/LanguageContext';

interface BuilderChatProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function BuilderChat({ onBack }: BuilderChatProps) {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<Content[]>([]);

  // Initialize chat when language changes or component mounts
  useEffect(() => {
    setMessages([
      { role: 'model', text: t.chat.initialMessage }
    ]);
    setChatHistory([
      { 
        role: 'user', 
        parts: [{ text: t.chat.systemPrompt }] 
      },
      {
        role: 'model',
        parts: [{ text: t.chat.initialMessage }]
      }
    ]);
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Prepare history for API
      const newHistory = [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ];

      const ai = getAi();
      const response = await ai.models.generateContent({
        model: MODELS.text,
        contents: newHistory,
      });

      const responseText = response.text || t.chat.thinking;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setChatHistory([...newHistory, { role: 'model', parts: [{ text: responseText }] }]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: t.chat.error }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'model', text: t.chat.initialMessage }
    ]);
    setChatHistory([
      { 
        role: 'user', 
        parts: [{ text: t.chat.systemPrompt }] 
      },
      {
        role: 'model',
        parts: [{ text: t.chat.initialMessage }]
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-green-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-green-800" />
          </button>
          <h2 className="text-3xl text-green-800">{t.chat.title}</h2>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
          title={t.chat.clear}
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline">{t.chat.clear}</span>
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-xl border-b-8 border-green-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-50 text-slate-800 rounded-tr-none' 
                  : 'bg-green-50 text-slate-800 rounded-tl-none border border-green-100'
              }`}>
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="bg-green-50 p-4 rounded-2xl rounded-tl-none border border-green-100">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chat.placeholder}
              className="flex-1 p-4 rounded-xl border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-lg"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg active:scale-95"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
