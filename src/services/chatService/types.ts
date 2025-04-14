
/**
 * Define types for the chat service
 */
export interface ChatServiceError {
  message: string;
  code: string;
  originalError?: any;
}

// Re-exporting the chat types for convenience
export type { ChatSession, ChatMessage } from '@/types/chat';
