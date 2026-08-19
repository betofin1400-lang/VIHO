'use client';

import { Send, Loader2 } from 'lucide-react';
import { type ChatMessage } from './chatData';

interface ChatMessagesProps {
  messages: ChatMessage[];
  onOptionClick: (option: string) => void;
  onSendText: (text: string) => void;
  isLoading?: boolean;
}

export default function ChatMessages({ messages, onOptionClick, onSendText, isLoading }: ChatMessagesProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('chat-input') as HTMLInputElement;
    const value = input.value.trim();
    if (value && !isLoading) {
      onSendText(value);
      input.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#DEA71A] text-black rounded-br-md'
                  : 'bg-[#2A2A2A] text-[#CCCBCD] border border-white/5 rounded-bl-md'
              }`}
            >
              {msg.text}
              {msg.options && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => onOptionClick(opt)}
                      disabled={isLoading}
                      className="bg-[#0E2B1D] hover:bg-[#0E2B1D]/80 text-[#DEA71A] border border-[#DEA71A]/30 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#2A2A2A] border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 size={18} className="text-[#DEA71A] animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 flex gap-2">
        <input
          name="chat-input"
          type="text"
          placeholder={isLoading ? 'Escribiendo...' : 'Escribe tu respuesta...'}
          disabled={isLoading}
          className="flex-1 bg-[#2A2A2A] border border-white/10 rounded-full px-4 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#DEA71A] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-10 h-10 rounded-full bg-[#DEA71A] hover:bg-[#E1CB82] flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={16} className="text-black animate-spin" />
          ) : (
            <Send size={16} className="text-black" />
          )}
        </button>
      </form>
    </div>
  );
}
