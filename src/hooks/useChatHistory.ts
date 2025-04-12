
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  keywords?: string[];
  summary?: string[];
  followUps?: string[];
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

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
      
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform the data into our ChatSession format
      const chatSessions = data.map(chat => ({
        id: chat.id,
        title: chat.title,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
        messages: [] // We'll load messages only when needed
      }));
      
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

  // Load messages for a specific chat
  const loadChatMessages = async (chatId: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      const messages = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.is_user,
        keywords: msg.keywords || [],
        summary: msg.summary || [],
        followUps: msg.follow_ups || [],
        createdAt: msg.created_at
      }));
      
      return messages;
    } catch (error) {
      console.error('Error loading chat messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Create a new chat session
  const createChat = async (title: string): Promise<ChatSession | null> => {
    // Handle case when there is no user but we're in dev mode with hardcoded user
    if (!user && !user?.id) {
      // Create a mock chat session for development
      const mockChat: ChatSession = {
        id: `mock-${Date.now()}`,
        title: title || 'New chat',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      
      setChats(prev => [mockChat, ...prev]);
      setActiveChat(mockChat);
      return mockChat;
    }

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          title: title || 'New chat'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newChat = {
        id: data.id,
        title: data.title,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        messages: []
      };
      
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
      return message;
    }

    if (!user) return null;

    try {
      // Update the chat's updated_at timestamp
      await supabase
        .from('chat_history')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);
      
      // Insert the message
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          content: message.content,
          is_user: message.isUser,
          keywords: message.keywords || [],
          summary: message.summary || [],
          follow_ups: message.followUps || []
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // If this is the active chat, update its messages
      if (activeChat && activeChat.id === chatId) {
        const newMessage = {
          id: data.id,
          content: data.content,
          isUser: data.is_user,
          keywords: data.keywords || [],
          summary: data.summary || [],
          followUps: data.follow_ups || [],
          createdAt: data.created_at
        };
        
        setActiveChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage],
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
      
      return data;
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
    // For mock chats (development without auth)
    if (chatId.startsWith('mock-')) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setActiveChat(chat);
        return chat;
      }
      return null;
    }
    
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return null;
    
    const messages = await loadChatMessages(chatId);
    
    const selectedChat = {
      ...chat,
      messages
    };
    
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
      const { error } = await supabase
        .from('chat_history')
        .update({ title })
        .eq('id', chatId);
      
      if (error) {
        throw error;
      }
      
      // Update in state
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      ));
      
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(prev => prev ? { ...prev, title } : null);
      }
      
      return true;
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
      // Delete the chat (cascade will handle messages)
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', chatId);
      
      if (error) {
        throw error;
      }
      
      // Update state
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If this was the active chat, clear it
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(null);
      }
      
      return true;
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

  // Load chats on component mount
  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setChats([]);
      setActiveChat(null);
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
