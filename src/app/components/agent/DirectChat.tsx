'use client';

import { useRef, useEffect } from 'react';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-[#0E2B1D] to-[#1A3D2C] border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/landing"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#DEA71A]/20 flex items-center justify-center border border-[#DEA71A]/30">
                <Bot size={24} className="text-[#DEA71A]" />
              </div>
              <div>
                <div className="text-white font-semibold">Asistente VIHO</div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                  <span className="text-[#CCCBCD]/60 text-xs">
                    {isLoading ? 'Escribiendo...' : 'En línea · Listo para ayudarte'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#CCCBCD]/40 text-xs">
            <Sparkles size={14} className="text-[#DEA71A]" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </div>

      {/* Main area: sidebar + chat */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - project summary */}
        <div className="hidden lg:flex w-80 bg-[#1A1A1A] border-r border-white/5 flex-col p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#DEA71A]/20 flex items-center justify-center">
              <span className="text-[#DEA71A] text-sm font-bold">📋</span>
            </div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Tu Proyecto</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[#CCCBCD]/60">Tipo</span>
                <span className="text-[#CCCBCD] font-medium">—</span>
              </div>
            </div>
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[#CCCBCD]/60">Tipología</span>
                <span className="text-[#CCCBCD] font-medium">—</span>
              </div>
            </div>
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[#CCCBCD]/60">Área</span>
                <span className="text-[#CCCBCD] font-medium">—</span>
              </div>
            </div>
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[#CCCBCD]/60">Tendencia</span>
                <span className="text-[#CCCBCD] font-medium">—</span>
              </div>
            </div>
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[#CCCBCD]/60">Presupuesto</span>
                <span className="text-[#CCCBCD] font-medium">—</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <h4 className="text-white/60 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#DEA71A]/20 flex items-center justify-center text-[10px]">✓</span>
              Compromisos
            </h4>
            <div className="space-y-3 text-xs text-[#CCCBCD]/60">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A] mt-1.5 shrink-0" />
                <span>Visita técnica: máximo 3 días hábiles</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A] mt-1.5 shrink-0" />
                <span>Diseño y cotización: máximo 7 días hábiles</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A] mt-1.5 shrink-0" />
                <span>Ajustes: máximo 48 horas hábiles</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A] mt-1.5 shrink-0" />
                <span>Entrega: hasta 40 días calendario</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
              <div className="text-[#CCCBCD]/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>70% anticipo</span>
                  <span className="text-[#DEA71A]">30% contra entrega</span>
                </div>
              </div>
            </div>
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
