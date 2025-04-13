
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ChatItem, ChatHistoryItem } from './ChatHistoryItem';

interface ChatHistoryGroupProps {
  group: {
    date: string;
    chats: ChatItem[];
  };
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export const ChatHistoryGroup: React.FC<ChatHistoryGroupProps> = ({ 
  group,
  onSelectChat,
  onDeleteChat,
  onRenameChat
}) => {
  return (
    <div key={group.date} className="mb-6">
      <div className="flex items-center gap-2 px-4 mb-2">
        <CalendarDays size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">{group.date}</h3>
      </div>
      
      <div className="space-y-1">
        {group.chats.map((chat) => (
          <ChatHistoryItem 
            key={chat.id} 
            chat={chat} 
            onSelect={onSelectChat}
            onDelete={onDeleteChat}
            onRename={onRenameChat}
          />
        ))}
      </div>
      
      <Separator className="mt-4 mb-4" />
    </div>
  );
};
