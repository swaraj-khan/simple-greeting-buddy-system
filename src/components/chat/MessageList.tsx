
import React, { useRef, useEffect } from 'react';
import ResponseCard from '../ResponseCard';
import { ChatMessage } from '@/hooks/useChatHistory';

interface MessageListProps {
  messages: ChatMessage[];
  onFollowUpClick: (text: string) => void;
}

const MessageList = ({ messages, onFollowUpClick }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="pt-20 pb-40 px-4 max-w-4xl mx-auto">
      <div className="space-y-6">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {message.isUser ? (
              <div className="bg-draconic-orange/20 rounded-lg p-4 max-w-[80%]">
                <p className="text-foreground">{message.content}</p>
              </div>
            ) : (
              <ResponseCard 
                keywords={message.keywords || []}
                summary={message.summary || []}
                followUps={message.followUps || []}
                onFollowUpClick={onFollowUpClick}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
