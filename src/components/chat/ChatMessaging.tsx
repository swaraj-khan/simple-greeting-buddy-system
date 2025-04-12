
import React from 'react';
import { ChatMessage } from '@/hooks/useChatHistory';
import MessageList from './MessageList';

interface ChatMessagingProps {
  messages: ChatMessage[];
  onFollowUpClick: (text: string) => void;
  isInitial: boolean;
}

const ChatMessaging: React.FC<ChatMessagingProps> = ({ 
  messages, 
  onFollowUpClick,
  isInitial
}) => {
  if (isInitial || messages.length === 0) {
    return null;
  }
  
  return (
    <MessageList 
      messages={messages} 
      onFollowUpClick={onFollowUpClick} 
    />
  );
};

export default ChatMessaging;
