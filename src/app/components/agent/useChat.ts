'use client';

import { useState, useCallback } from 'react';
import { type ChatMessage, WELCOME_MESSAGE } from './chatData';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? 'user' as const : 'model' as const,
        parts: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!res.ok) throw new Error('Error en la API');

      const data = await res.json();
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'agent',
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const resetChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, resetChat };
}
