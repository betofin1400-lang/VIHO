'use client';

import { Send, Loader2, Paperclip, X, Image as ImageIcon, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { type ChatMessage } from './chatData';

interface ChatMessagesProps {
  messages: ChatMessage[];
  onOptionClick: (option: string) => void;
  onSendText: (text: string, image?: { data: string; mimeType: string; preview: string }) => void;
  isLoading?: boolean;
}

export default function ChatMessages({ messages, onOptionClick, onSendText, isLoading }: ChatMessagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Solo se permiten imágenes (JPG, PNG) y PDFs.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo no puede superar 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const preview = URL.createObjectURL(file);
      setPendingImage({
        data: base64,
        mimeType: file.type,
        preview,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePendingImage = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage.preview);
    }
    setPendingImage(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('chat-input') as HTMLInputElement;
    const value = input.value.trim();

    if ((!value && !pendingImage) || isLoading) return;

    onSendText(value || (pendingImage ? 'Analiza este archivo:' : ''), pendingImage || undefined);
    removePendingImage();
    input.value = '';
  };

  const handleOptionClick = (option: string) => {
    onOptionClick(option);
  };

  const formatMessageText = (text: string) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-xs">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-1' : 'order-1'}`}>
              {/* Agent avatar */}
              {msg.sender === 'agent' && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#DEA71A]/20 flex items-center justify-center">
                    <span className="text-[#DEA71A] text-xs font-bold">V</span>
                  </div>
                  <span className="text-[#CCCBCD]/50 text-xs">Asistente VIHO</span>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-[#DEA71A] to-[#E1CB82] text-black rounded-br-md shadow-lg shadow-[#DEA71A]/10'
                    : 'bg-[#2A2A2A] text-[#E5E5E5] border border-white/5 rounded-bl-md'
                }`}
              >
                {/* Image attachment */}
                {msg.image && (
                  <div className="mb-3">
                    <img
                      src={msg.image.preview}
                      alt="Archivo adjunto"
                      className="rounded-lg max-h-48 object-cover border border-white/10"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs opacity-60">
                      {msg.image.mimeType.startsWith('image/') ? (
                        <ImageIcon size={12} />
                      ) : (
                        <FileText size={12} />
                      )}
                      <span>Adjunto</span>
                    </div>
                  </div>
                )}

                {/* Message text */}
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }}
                />
              </div>

              {/* Options as professional buttons */}
              {msg.options && msg.options.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.options.map((opt, idx) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
                      disabled={isLoading}
                      className="w-full text-left px-4 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#DEA71A]/20 hover:border-[#DEA71A]/40 text-[#DEA71A] text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-lg hover:shadow-[#DEA71A]/5"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        animation: 'fadeInUp 0.3s ease-out forwards',
                        opacity: 0,
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#DEA71A]/10 group-hover:bg-[#DEA71A]/20 flex items-center justify-center text-xs font-bold transition-colors">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#DEA71A]/20 flex items-center justify-center">
                  <span className="text-[#DEA71A] text-xs font-bold">V</span>
                </div>
                <span className="text-[#CCCBCD]/50 text-xs">Asistente VIHO</span>
              </div>
              <div className="bg-[#2A2A2A] border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#DEA71A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#DEA71A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#DEA71A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[#CCCBCD]/60 text-xs">Escribiendo...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="h-2" />
      </div>

      {/* Pending image preview */}
      {pendingImage && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">
            <img
              src={pendingImage.preview}
              alt="Vista previa"
              className="h-24 rounded-xl border border-white/10 object-cover"
            />
            <button
              onClick={removePendingImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <X size={14} className="text-white" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl px-2 py-1">
              <span className="text-white text-xs">列表图片</span>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-white/10 flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
            title="Adjuntar imagen o PDF"
          >
            <Paperclip size={18} className="text-[#DEA71A]" />
          </button>
          <div className="flex-1 relative">
            <input
              name="chat-input"
              type="text"
              placeholder={isLoading ? 'Escribiendo...' : 'Escribe tu respuesta...'}
              disabled={isLoading}
              className="w-full bg-[#2A2A2A] border border-white/10 rounded-full px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#DEA71A]/50 focus:ring-1 focus:ring-[#DEA71A]/20 transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || (!pendingImage)}
            className="w-10 h-10 rounded-full bg-[#DEA71A] hover:bg-[#E1CB82] flex items-center justify-center transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#DEA71A]/20"
          >
            {isLoading ? (
              <Loader2 size={18} className="text-black animate-spin" />
            ) : (
              <Send size={18} className="text-black" />
            )}
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-[#CCCBCD]/30 text-xs">
            Powered by VIHO Arquitectura · Gemini AI
          </span>
        </div>
      </form>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
