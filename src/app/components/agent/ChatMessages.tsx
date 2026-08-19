'use client';

import { Send, Loader2, Paperclip, X } from 'lucide-react';
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

    // Only allow images and PDFs
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Solo se permiten imágenes (JPG, PNG) y PDFs.');
      return;
    }

    // Max 10MB
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

    // Reset input so same file can be selected again
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
              {msg.image && (
                <div className="mb-2">
                  <img
                    src={msg.image.preview}
                    alt="Archivo adjunto"
                    className="rounded-lg max-h-40 object-cover"
                  />
                </div>
              )}
              {msg.text}
              {msg.options && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
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

      {/* Pending image preview */}
      {pendingImage && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">
            <img
              src={pendingImage.preview}
              alt="Vista previa"
              className="h-20 rounded-lg border border-white/10"
            />
            <button
              onClick={removePendingImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 flex gap-2">
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
          <Paperclip size={16} className="text-[#DEA71A]" />
        </button>
        <input
          name="chat-input"
          type="text"
          placeholder={isLoading ? 'Escribiendo...' : 'Escribe tu respuesta...'}
          disabled={isLoading}
          className="flex-1 bg-[#2A2A2A] border border-white/10 rounded-full px-4 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#DEA71A] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || (!pendingImage)}
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
