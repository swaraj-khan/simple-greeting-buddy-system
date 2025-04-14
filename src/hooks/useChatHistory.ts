
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, ChatSession, ChatHistoryGroup } from '@/types/chat';
import * as chatService from '@/services/chatService';
import { supabase } from '@/integrations/supabase/client';

export { ChatMessage, ChatSession, ChatHistoryGroup };

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch chat history
  const fetchChatHistory = async () => {
    if (!user || !user.id) {
      setChatHistory([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const groupedChats = await chatService.fetchChatHistoryForUser(user.id);
      setChatHistory(groupedChats);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new chat
  const createNewChat = async (title: string = 'New Chat') => {
    if (!user || !user.id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create new chats',
        variant: 'destructive'
      });
      return null;
    }
    
    try {
      const chatId = await chatService.createNewChatForUser(user.id, title);
      setCurrentChatId(chatId);
      setCurrentChatMessages([]);
      fetchChatHistory();
      return chatId;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Load chat session
  const loadChatSession = async (chatId: string) => {
    if (!user || !user.id) return [];
    
    setCurrentChatId(chatId);
    try {
      const messages = await chatService.loadChatSessionMessages(chatId);
      setCurrentChatMessages(messages);
      return messages;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive'
      });
      return [];
    }
  };

  // Add message to current chat
  const addMessageToChat = async (message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    if (!user || !user.id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to send messages',
        variant: 'destructive'
      });
      return null;
    }
    
    try {
      const newMessage = await chatService.addMessageToChat(user.id, currentChatId, message);
      if (newMessage) {
        setCurrentChatMessages(prev => [...prev, newMessage]);
        // If this was a new chat, update the currentChatId
        if (!currentChatId && newMessage) {
          const chatIdFromMessage = await supabase
            .from('chat_messages')
            .select('chat_id')
            .eq('id', newMessage.id)
            .single();
            
          if (chatIdFromMessage.data) {
            setCurrentChatId(chatIdFromMessage.data.chat_id);
          }
        }
      }
      return newMessage;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save message',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Update chat title
  const updateChatTitle = async (chatId: string, newTitle: string) => {
    if (!user || !user.id) return false;
    
    try {
      const success = await chatService.updateChatTitle(user.id, chatId, newTitle);
      if (success) {
        fetchChatHistory();
      }
      return success;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update chat title',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Delete chat
  const deleteChat = async (chatId: string) => {
    if (!user || !user.id) return false;
    
    try {
      const success = await chatService.deleteChat(user.id, chatId);
      if (success) {
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setCurrentChatMessages([]);
        }
        fetchChatHistory();
      }
      return success;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete chat',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Fetch chat history on mount and when user changes
  useEffect(() => {
    if (user && user.id) {
      fetchChatHistory();
    } else {
      // Clear the state when user is not authenticated
      setChatHistory([]);
      setCurrentChatId(null);
      setCurrentChatMessages([]);
    }
  }, [user]);

  return {
    chatHistory,
    currentChatId,
    currentChatMessages,
    isLoading,
    createNewChat,
    loadChatSession,
    addMessageToChat,
    updateChatTitle,
    deleteChat,
    setCurrentChatId,
    setCurrentChatMessages
  };
};
