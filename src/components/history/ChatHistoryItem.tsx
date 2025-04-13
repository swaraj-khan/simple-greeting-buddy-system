
import React from 'react';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface ChatItem {
  id: string;
  title: string;
  time: string;
}

interface ChatHistoryItemProps {
  chat: ChatItem;
  onSelect: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ 
  chat, 
  onSelect, 
  onDelete, 
  onRename 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const handleSelect = () => {
    if (!isEditing) {
      onSelect(chat.id);
    }
  };

  const handleSave = () => {
    onRename(chat.id, newTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setNewTitle(chat.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full text-left px-4 py-3 flex items-start hover:bg-accent rounded-md transition-colors group relative">
      {isEditing ? (
        <div className="flex items-center w-full space-x-2">
          <Input 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
            autoFocus
          />
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setNewTitle(chat.title);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <button 
            key={chat.id} 
            className="flex items-start flex-1"
            onClick={handleSelect}
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
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Pencil size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rename</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-destructive" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
};
