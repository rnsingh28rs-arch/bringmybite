import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, X, Send, Utensils, HelpCircle, PhoneCall } from 'lucide-react';

export const ChatBox: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendChatMessage,
    setIsInstantOrderOpen,
    setIsRegistrationOpen
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal.trim());
    setInputVal('');
  };

  const handleQuickSuggestion = (text: string) => {
    if (text.includes('Instant') || text.includes('Order')) {
      setIsInstantOrderOpen(true);
    } else if (text.includes('Subscribe') || text.includes('Monthly') || text.includes('Register')) {
      setIsRegistrationOpen(true);
    }
    sendChatMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="group relative flex items-center gap-2.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#D99B26]"
          aria-label="Open support chat"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
          <span className="font-bold text-sm tracking-wide hidden sm:inline">Ask / Order Chat</span>
        </button>
      )}

      {/* Chat Popup Box */}
      {isChatOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-200">
          
          {/* Chat Header */}
          <div className="bg-[#124E33] text-white p-4 flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D99B26] text-black flex items-center justify-center font-black text-sm shadow-xs">
                BMB
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Bring My Bite Support
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[11px] text-emerald-200">Shree Foods • Online & Instant</p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF7F2]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#124E33] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Optional Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickSuggestion(sug)}
                        className="text-[11px] font-semibold bg-white hover:bg-[#FDF7E7] text-[#124E33] hover:text-[#8C5E13] border border-emerald-700/30 hover:border-[#C88A24] px-2.5 py-1 rounded-full shadow-2xs transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Footer */}
          <div className="bg-emerald-50/70 border-t border-gray-100 px-3 py-1.5 flex items-center justify-around text-[11px] text-emerald-800 font-medium">
            <button
              onClick={() => setIsInstantOrderOpen(true)}
              className="flex items-center gap-1 hover:text-emerald-950 font-bold"
            >
              <Utensils className="w-3.5 h-3.5 text-[#C88A24]" />
              <span>Instant Thali</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="flex items-center gap-1 hover:text-emerald-950 font-bold"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Subscription</span>
            </button>
            <span>•</span>
            <a
              href="tel:9004848984"
              className="flex items-center gap-1 hover:text-emerald-950 font-bold text-amber-800"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about today's meal, price, gate..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#124E33] focus:ring-1 focus:ring-[#124E33]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 bg-[#124E33] text-white rounded-xl hover:bg-[#0A2A1B] disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
