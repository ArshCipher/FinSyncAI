// Message sender types
export type Sender = 'user' | 'assistant' | 'system';

// Agent types for multi-agent orchestration
export type AgentType = 'master' | 'sales' | 'verification' | 'underwriting' | 'sanction';

// Message metadata
export interface MessageMeta {
  agent?: AgentType;
}

// Core message interface
export interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string;
  meta?: MessageMeta;
}

// API request/response types
export interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponse {
  reply: string;
  agent?: AgentType;
}
