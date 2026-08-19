'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, MessageSquare, Minus } from 'lucide-react';
import ChatMessages from './ChatMessages';
import { useChat } from './useChat';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleOptionClick = async (option: string) => {
    await sendMessage(option);
    if (!isOpen) setHasNewMessage(true);
  };

  const handleSendText = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <>
      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 md:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md h-[600px] max-h-[85vh] bg-[#1A1A1A] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0E2B1D] to-[#1A3D2C] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DEA71A]/20 flex items-center justify-center border border-[#DEA71A]/30">
                  <MessageSquare size={20} className="text-[#DEA71A]" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Asistente VIHO</div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                    <span className="text-[#CCCBCD]/60 text-xs">
                      {isLoading ? 'Escribiendo...' : 'En línea'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Minus size={16} className="text-white/60" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden bg-[#1A1A1A]">
              <ChatMessages
                messages={messages}
                onOptionClick={handleOptionClick}
                onSendText={handleSendText}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className="fixed bottom-6 right-6 z-[90] w-16 h-16 rounded-full bg-gradient-to-br from-[#DEA71A] to-[#E1CB82] hover:from-[#E1CB82] hover:to-[#DEA71A] shadow-lg shadow-[#DEA71A]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer group"
      >
        {isOpen ? (
          <X size={24} className="text-black group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MessageCircle size={24} className="text-black group-hover:scale-110 transition-transform duration-300" />
        )}
        {!isOpen && hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#0E2B1D] animate-pulse" />
        )}
        {!isOpen && (
          <span className="absolute -bottom-8 right-0 bg-[#0E2B1D] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            ¿Necesitas ayuda?
          </span>
        )}
      </button>
    </>
  );
}
