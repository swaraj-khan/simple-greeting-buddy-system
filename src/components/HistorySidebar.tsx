
import React, { useState } from 'react';
import { CalendarDays, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { useChatHistory, ChatSession } from '@/hooks/useChatHistory';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Skeleton } from './ui/skeleton';

interface HistorySidebarProps {
  onSelectChat: (chat: ChatSession) => void;
  onNewChat: () => void;
}

export const HistorySidebar = ({ onSelectChat, onNewChat }: HistorySidebarProps) => {
  const { chats, loading, deleteChat, updateChatTitle } = useChatHistory();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  // Group chats by date
  const groupedChats = React.useMemo(() => {
    const groups: { [key: string]: ChatSession[] } = {};
    
    chats.forEach(chat => {
      const date = new Date(chat.updatedAt);
      let groupKey: string;
      
      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else {
        groupKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(chat);
    });
    
    return Object.entries(groups);
  }, [chats]);

  const handleEdit = (chat: ChatSession) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async (chatId: string) => {
    const success = await updateChatTitle(chatId, editTitle);
    if (success) {
      toast({
        title: 'Success',
        description: 'Chat title updated',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update chat title',
        variant: 'destructive',
      });
    }
    setEditingChatId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    
    const success = await deleteChat(deleteConfirm);
    if (success) {
      toast({
        title: 'Success',
        description: 'Chat deleted',
      });
    }
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="h-full pt-4 overflow-y-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6">
            <div className="flex items-center gap-2 px-4 mb-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            
            {[1, 2].map((j) => (
              <div key={j} className="px-4 py-3">
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
            
            <Separator className="mt-4 mb-4" />
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground mb-6">No chat history yet</p>
        <Button onClick={onNewChat}>Start a new chat</Button>
      </div>
    );
  }

  return (
    <div className="h-full pt-4 overflow-y-auto">
      <div className="px-4 mb-4">
        <Button 
          variant="outline"
          className="w-full"
          onClick={onNewChat}
        >
          New chat
        </Button>
      </div>
      
      {groupedChats.map(([date, dateChats]) => (
        <div key={date} className="mb-6">
          <div className="flex items-center gap-2 px-4 mb-2">
            <CalendarDays size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
          </div>
          
          <div className="space-y-1">
            {dateChats.map((chat) => (
              <div key={chat.id} className="px-4 py-2">
                {editingChatId === chat.id ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)} 
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => handleSaveEdit(chat.id)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectChat(chat)}
                    className="w-full text-left flex items-start hover:bg-accent rounded-md transition-colors group p-2"
                  >
                    <MessageSquare size={16} className="mt-0.5 mr-3 text-muted-foreground group-hover:text-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-foreground">
                        {chat.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(chat);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(chat.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <Separator className="mt-4 mb-4" />
        </div>
      ))}
      
      <div className="px-4 py-3 mt-auto">
        <p className="text-xs text-center text-muted-foreground">
          Your conversations are saved for future reference
        </p>
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat and all its messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
