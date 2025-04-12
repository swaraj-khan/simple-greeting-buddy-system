
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, ChatSession } from './types';
import {
  createMockChat,
  createSupabaseChat,
  loadChatMessages,
  saveSupabaseMessage,
  updateChatTitleInSupabase,
  deleteChatFromSupabase,
  loadUserChats
} from './chatActions';

export { type ChatMessage, type ChatSession } from './types';

export const useChatHistory = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load all chats for the current user
  const loadChats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const chatSessions = await loadUserChats(user.id);
      setChats(chatSessions);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat session
  const createChat = async (title: string): Promise<ChatSession | null> => {
    // Handle case when there is no user but we're in dev mode with hardcoded user
    if (!user || !user.id) {
      // Create a mock chat session for development
      const mockChat = createMockChat(title);
      setChats(prev => [mockChat, ...prev]);
      setActiveChat(mockChat);
      return mockChat;
    }

    try {
      const newChat = await createSupabaseChat(user.id, title);
      if (!newChat) {
        toast({
          title: 'Error',
          description: 'Failed to create new chat',
          variant: 'destructive',
        });
        return null;
      }
      
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat);
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Save a message to a chat session
  const saveMessage = async (chatId: string, message: ChatMessage) => {
    // For mock chats (development without auth)
    if (chatId.startsWith('mock-')) {
      // Just update the local state
      setActiveChat(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, message],
          updatedAt: new Date().toISOString()
        };
      });
      
      // Update the chat in the list to show it as the most recent
      setChats(prev => {
        const updatedChats = prev.filter(c => c.id !== chatId);
        const updatedChat = prev.find(c => c.id === chatId);
        if (updatedChat) {
          const newChat = {
            ...updatedChat, 
            updatedAt: new Date().toISOString()
          };
          return [newChat, ...updatedChats];
        }
        return prev;
      });
      
      return message;
    }

    if (!user) return null;

    try {
      const savedMessage = await saveSupabaseMessage(chatId, message);
      
      if (!savedMessage) {
        throw new Error("Failed to save message");
      }
      
      // If this is the active chat, update its messages
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, savedMessage],
          updatedAt: new Date().toISOString()
        } : null);
      }
      
      // Update the chat list to reflect the latest chat first
      setChats(prev => {
        const updatedChats = prev.filter(c => c.id !== chatId);
        const updatedChat = prev.find(c => c.id === chatId);
        if (updatedChat) {
          return [{...updatedChat, updatedAt: new Date().toISOString()}, ...updatedChats];
        }
        return prev;
      });
      
      return savedMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: 'Error',
        description: 'Failed to save message',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Set the active chat and load its messages
  const selectChat = async (chatId: string) => {
    console.log("Selecting chat with ID:", chatId);
    
    // For mock chats (development without auth)
    if (chatId.startsWith('mock-')) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        console.log("Found mock chat:", chat);
        setActiveChat(chat);
        return chat;
      }
      return null;
    }
    
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      console.log("Chat not found in local state");
      return null;
    }
    
    console.log("Found chat in local state, loading messages");
    const messages = await loadChatMessages(chatId);
    
    const selectedChat = {
      ...chat,
      messages
    };
    
    console.log("Setting active chat with messages:", selectedChat);
    setActiveChat(selectedChat);
    return selectedChat;
  };

  // Update chat title
  const updateChatTitle = async (chatId: string, title: string) => {
    // For mock chats (development without auth)
    if (chatId.startsWith('mock-')) {
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      ));
      
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(prev => prev ? { ...prev, title } : null);
      }
      
      return true;
    }

    if (!user) return false;

    try {
      const success = await updateChatTitleInSupabase(chatId, title);
      
      if (success) {
        // Update in state
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, title } : chat
        ));
        
        if (activeChat && activeChat.id === chatId) {
          setActiveChat(prev => prev ? { ...prev, title } : null);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error updating chat title:', error);
      return false;
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string) => {
    // For mock chats (development without auth)
    if (chatId.startsWith('mock-')) {
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(null);
      }
      
      return true;
    }

    if (!user) return false;

    try {
      const success = await deleteChatFromSupabase(chatId);
      
      if (success) {
        // Update state
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        
        // If this was the active chat, clear it
        if (activeChat && activeChat.id === chatId) {
          setActiveChat(null);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Load chats on component mount or when user changes
  useEffect(() => {
    if (user) {
      console.log("User changed, loading chats for user:", user.id);
      loadChats();
    } else {
      console.log("No user, clearing chats");
      setChats([]);
      setActiveChat(null);
      setLoading(false);
    }
  }, [user]);

  return {
    chats,
    activeChat,
    loading,
    createChat,
    selectChat,
    saveMessage,
    updateChatTitle,
    deleteChat,
    loadChats
  };
};
