'use client';

import { useRef, useEffect } from 'react';
import { ArrowLeft, Bot } from 'lucide-react';
import Link from 'next/link';
import ChatMessages from './ChatMessages';
import { useChat } from './useChat';

export default function DirectChat() {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionClick = async (option: string) => {
    await sendMessage(option);
  };

  const handleSendText = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0E2B1D]">
      {/* Header */}
      <div className="bg-[#0E2B1D] border-b border-white/5 px-4 py-3 flex items-center gap-4">
        <Link
          href="/landing"
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DEA71A]/20 flex items-center justify-center">
            <Bot size={20} className="text-[#DEA71A]" />
          </div>
          <div>
            <div className="text-white font-semibold">Asistente VIHO</div>
            <div className="text-[#CCCBCD]/60 text-xs">
              {isLoading ? 'Escribiendo...' : 'En línea · Listo para ayudarte'}
            </div>
          </div>
        </div>
      </div>

      {/* Main area: sidebar + chat */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - project summary */}
        <div className="hidden lg:flex w-72 bg-[#1A1A1A] border-r border-white/5 flex-col p-6">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tu Proyecto</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#CCCBCD]/60">Tipo</span>
              <span className="text-[#CCCBCD]">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CCCBCD]/60">Tipología</span>
              <span className="text-[#CCCBCD]">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CCCBCD]/60">Área</span>
              <span className="text-[#CCCBCD]">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CCCBCD]/60">Tendencia</span>
              <span className="text-[#CCCBCD]">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CCCBCD]/60">Presupuesto</span>
              <span className="text-[#CCCBCD]">—</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <h4 className="text-white/60 text-xs uppercase tracking-wider mb-3">Compromisos</h4>
            <div className="space-y-2 text-xs text-[#CCCBCD]/60">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A]" />
                Visita técnica: máx. 3 días hábiles
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A]" />
                Diseño y cotización: máx. 7 días
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A]" />
                Entrega: hasta 40 días calendario
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-[#CCCBCD]/40 text-xs italic">
              * Powered by Gemini 3.6 Flash
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-[#1A1A1A]">
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
    </div>
  );
}
