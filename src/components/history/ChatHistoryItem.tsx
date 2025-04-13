
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatItem } from '@/data/chatHistoryData';

interface ChatHistoryItemProps {
  chat: ChatItem;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ chat }) => {
  return (
    <button
      key={chat.id}
      className="w-full text-left px-4 py-3 flex items-start hover:bg-accent rounded-md transition-colors group"
    >
      <MessageSquare size={16} className="mt-0.5 mr-3 text-muted-foreground group-hover:text-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-foreground">
          {chat.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {chat.time}
        </p>
      </div>
    </button>
  );
};
