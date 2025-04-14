
import React from 'react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { ChatHistoryGroup } from '@/types/chat';
import { ChatHistoryGroup as ChatHistoryGroupComponent } from './history/ChatHistoryGroup';
import { ChatHistoryFooter } from './history/ChatHistoryFooter';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from './ui/skeleton';

interface HistorySidebarProps {
  onSelectChat: (chatId: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ onSelectChat }) => {
  const { 
    chatHistory, 
    isLoading, 
    createNewChat, 
    deleteChat, 
    updateChatTitle 
  } = useChatHistory();
  
  const { user } = useAuth();

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId) {
      onSelectChat(newChatId);
    }
  };

  if (!user) {
    return (
      <div className="h-full pt-4 flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Please sign in to view your chat history
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={handleNewChat}
        >
          <PlusCircle size={16} />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mt-4" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : chatHistory.length > 0 ? (
          chatHistory.map((group) => (
            <ChatHistoryGroup 
              key={group.date} 
              group={group} 
              onSelectChat={onSelectChat}
              onDeleteChat={deleteChat}
              onRenameChat={updateChatTitle}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No chat history found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a new conversation to see it here
            </p>
          </div>
        )}
      </div>
      
      <ChatHistoryFooter />
    </div>
  );
};
