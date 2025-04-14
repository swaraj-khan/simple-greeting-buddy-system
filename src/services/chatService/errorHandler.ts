
import { ChatServiceError } from './types';

/**
 * Standardized error handling for chat services
 */
export const handleServiceError = (error: any, operation: string): never => {
  console.error(`Error in chatService (${operation}):`, error);
  const errorMessage = error?.message || 'Unknown error occurred';
  const errorCode = error?.code || 'UNKNOWN_ERROR';
  
  throw {
    message: `Failed to ${operation}: ${errorMessage}`,
    code: errorCode,
    originalError: error
  } as ChatServiceError;
};
