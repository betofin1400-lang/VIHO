'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, MessageSquare } from 'lucide-react';
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
          <div className="relative w-full max-w-md h-[500px] max-h-[80vh] bg-[#1A1A1A] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0E2B1D] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#DEA71A]/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-[#DEA71A]" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Asistente VIHO</div>
                  <div className="text-[#CCCBCD]/60 text-xs">
                    {isLoading ? 'Escribiendo...' : 'En línea'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
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
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-[#DEA71A] hover:bg-[#E1CB82] shadow-lg shadow-[#DEA71A]/30 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
      >
        {isOpen ? (
          <X size={24} className="text-black" />
        ) : (
          <MessageCircle size={24} className="text-black" />
        )}
        {!isOpen && hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0E2B1D]" />
        )}
      </button>
    </>
  );
}
