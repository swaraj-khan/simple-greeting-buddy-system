
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  keywords?: string[];
  summary?: string[];
  followUps?: string[];
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}
