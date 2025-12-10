import { ChatRequest, ChatResponse } from '../types';

/**
 * Send chat messages to the backend API
 * This is a stub that you can later connect to your Groq-powered backend
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}
