import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '../chat/system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatMessage {
  role: 'user' | 'model';
  parts: string | Array<{ text: string } | { inlineData: { mimeType: string; data: string } }>;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada' },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No hay mensajes' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Gemini requires first message to be 'user'.
    // Skip any leading 'model' messages from history (like the welcome message).
    const allMessages: ChatMessage[] = messages;
    const firstUserIdx = allMessages.findIndex((m) => m.role === 'user');

    if (firstUserIdx === -1) {
      return NextResponse.json(
        { error: 'Se requiere al menos un mensaje del usuario' },
        { status: 400 }
      );
    }

    // History = everything except last message, starting from first 'user'
    const historyMessages = allMessages.slice(firstUserIdx, -1);
    const lastMessage = allMessages[allMessages.length - 1];

    const chat = model.startChat({
      history: historyMessages.map((msg) => ({
        role: msg.role,
        parts: typeof msg.parts === 'string'
          ? [{ text: msg.parts }]
          : msg.parts,
      })),
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    });

    // Send last message (can include images)
    const lastParts = typeof lastMessage.parts === 'string'
      ? [{ text: lastMessage.parts }]
      : lastMessage.parts;

    const result = await chat.sendMessage(lastParts);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error en chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: errorMessage },
      { status: 500 }
    );
  }
}
