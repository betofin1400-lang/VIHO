'use client';

import { useState, useCallback, useEffect } from 'react';
import { type ChatMessage, WELCOME_MESSAGE } from './chatData';

const CHAT_STORAGE_KEY = 'viho_chat_history';
const LEADS_STORAGE_KEY = 'viho_leads';

// Load chat from localStorage
function loadChat(): ChatMessage[] {
  if (typeof window === 'undefined') return [WELCOME_MESSAGE];
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: ChatMessage & { timestamp: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch {
    // If parsing fails, return welcome message
  }
  return [WELCOME_MESSAGE];
}

// Save chat to localStorage
function saveChat(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // localStorage might be full or disabled
  }
}

// Load leads from localStorage
export function loadLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(LEADS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // If parsing fails, return empty array
  }
  return [];
}

// Save lead to localStorage
function saveLead(lead: Lead) {
  if (typeof window === 'undefined') return;
  try {
    const leads = loadLeads();
    leads.push(lead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // localStorage might be full or disabled
  }
}

export interface Lead {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  projectType: string;
  projectTypology: string;
  area: string;
  trend: string;
  budget: string;
  aiEstimation: string;
  fullConversation: ChatMessage[];
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chat from localStorage on mount
  useEffect(() => {
    const storedChat = loadChat();
    setMessages(storedChat);
    setIsLoaded(true);
  }, []);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    if (isLoaded) {
      saveChat(messages);
    }
  }, [messages, isLoaded]);

  // Extract lead data from conversation
  const extractLeadData = useCallback((allMessages: ChatMessage[]): Partial<Lead> | null => {
    const userMessages = allMessages.filter(m => m.sender === 'user');
    const agentMessages = allMessages.filter(m => m.sender === 'agent');

    // Find the last user message (should be the email)
    const lastUserMsg = userMessages[userMessages.length - 1];
    if (!lastUserMsg) return null;

    // Try to extract email from the last user message
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = lastUserMsg.text.match(emailRegex);
    if (!emailMatch) return null;

    const email = emailMatch[0];

    // Find the name (usually the message before the email)
    const nameMsg = userMessages[userMessages.length - 2];
    const name = nameMsg ? nameMsg.text.replace(/[^\w\s]/g, '').trim() : 'Desconocido';

    // Extract project info from earlier messages
    let projectType = '';
    let projectTypology = '';
    let area = '';
    let trend = '';
    let budget = '';

    // Look for project type in early messages
    for (const msg of userMessages) {
      const text = msg.text.toLowerCase();
      if (['cocinas', 'baños', 'estudios', 'closets'].some(t => text.includes(t))) {
        projectType = msg.text;
      }
      if (['lineal', 'en l', 'península', 'isla', 'completo', 'medio', 'principal', 'infantil',
           'home office', 'creativo', 'ejecutivo', 'mixto', 'empotrado', 'walk-in', 'premium', 'abierto'
          ].some(t => text.includes(t))) {
        projectTypology = msg.text;
      }
      if (text.match(/\d+\s*m²/) || text.match(/\d+\s*metro/)) {
        area = msg.text;
      }
      if (['moderna', 'minimalista', 'clásica', 'industrial'].some(t => text.includes(t))) {
        trend = msg.text;
      }
      if (text.includes('millon') || text.includes('$') || text.match(/\d+/)) {
        budget = msg.text;
      }
    }

    // Get the last agent message (should be the estimation)
    const lastAgentMsg = agentMessages[agentMessages.length - 1];
    const aiEstimation = lastAgentMsg ? lastAgentMsg.text : '';

    return {
      name,
      email,
      projectType: projectType || 'No especificado',
      projectTypology: projectTypology || 'No especificado',
      area: area || 'No especificado',
      trend: trend || 'No especificado',
      budget: budget || 'No especificado',
      aiEstimation,
    };
  }, []);

  const sendMessage = useCallback(async (text: string, image?: { data: string; mimeType: string; preview: string }) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
      image,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMsg].map((m) => {
        const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

        if (m.image && m.sender === 'user') {
          parts.push({
            inlineData: {
              mimeType: m.image.mimeType,
              data: m.image.data,
            },
          });
        }

        if (m.text || parts.length === 0) {
          parts.push({ text: m.text });
        }

        return {
          role: m.sender === 'user' ? 'user' as const : 'model' as const,
          parts: parts.length === 1 && parts[0] && 'text' in parts[0]
            ? (parts[0] as { text: string }).text
            : parts,
        };
      });

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
      setMessages((prev) => {
        const newMessages = [...prev, agentMsg];

        // Check if we should capture a lead
        // Look for email pattern in user messages
        const allUserMsgs = newMessages.filter(m => m.sender === 'user');
        const lastUserMsg = allUserMsgs[allUserMsgs.length - 1];
        if (lastUserMsg) {
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
          if (emailRegex.test(lastUserMsg.text)) {
            // User just provided an email - capture the lead
            const leadData = extractLeadData(newMessages);
            if (leadData && leadData.email) {
              const lead: Lead = {
                id: `lead-${Date.now()}`,
                timestamp: new Date().toISOString(),
                name: leadData.name || 'Desconocido',
                email: leadData.email,
                projectType: leadData.projectType || 'No especificado',
                projectTypology: leadData.projectTypology || 'No especificado',
                area: leadData.area || 'No especificado',
                trend: leadData.trend || 'No especificado',
                budget: leadData.budget || 'No especificado',
                aiEstimation: leadData.aiEstimation || '',
                fullConversation: newMessages,
              };
              saveLead(lead);
            }
          }
        }

        return newMessages;
      });
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
  }, [messages, extractLeadData]);

  const resetChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  }, []);

  return { messages, isLoading, sendMessage, resetChat };
}
