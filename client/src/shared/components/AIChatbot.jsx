import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendChatMessage } from '../../features/ai/aiSlice';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hi! I am the CampusGuard AI assistant. How can I help you today?' }
  ]);
  
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { isLoading, chatResponse } = useSelector((state) => state.ai);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  useEffect(() => {
    if (chatResponse) {
      setChatHistory(prev => [...prev, { sender: 'bot', text: chatResponse }]);
    }
  }, [chatResponse]);

  // External trigger support
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openAIChatbot', handleOpen);
    return () => window.removeEventListener('openAIChatbot', handleOpen);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setChatHistory(prev => [...prev, userMessage]);
    setInput('');

    // Prepare history for API (excluding the immediate new message)
    const historyForApi = chatHistory.slice(1).map(msg => ({
      sender: msg.sender,
      text: msg.text
    }));

    dispatch(sendChatMessage({ history: historyForApi, message: userMessage.text }));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 flex items-center justify-center
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-gradient-to-tr from-indigo-600 to-violet-500 hover:shadow-indigo-500/40 hover:scale-110 active:scale-95'}
        `}
      >
        <Bot className="w-7 h-7 text-white" />
        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse pointer-events-none" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Bot className="w-6 h-6 text-indigo-50" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight flex items-center gap-1">
                    GuardBot <Sparkles className="w-3 h-3 text-amber-300" />
                  </h3>
                  <p className="text-xs text-indigo-100 font-medium">Campus AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-1">
                      <Bot className="w-3 h-3 text-indigo-600" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mb-1">
                      <User className="w-3 h-3 text-slate-500" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-1">
                    <Bot className="w-3 h-3 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ask me anything..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400 font-medium">AI generated content may be inaccurate</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
