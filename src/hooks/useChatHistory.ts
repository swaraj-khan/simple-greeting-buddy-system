
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  keywords?: string[];
  summary?: string[];
  followUps?: string[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  time: string;
  createdAt: string;
}

export interface ChatHistoryGroup {
  date: string;
  chats: ChatSession[];
}

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get formatted date for grouping
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  // Group chats by date
  const groupChatsByDate = (chats: ChatSession[]) => {
    const groups: Record<string, ChatSession[]> = {};
    
    chats.forEach(chat => {
      const date = getFormattedDate(chat.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(chat);
    });
    
    return Object.keys(groups).map(date => ({
      date,
      chats: groups[date]
    }));
  };

  // Fetch chat history
  const fetchChatHistory = async () => {
    if (!user || !user.id) {
      setChatHistory([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedChats: ChatSession[] = data.map(chat => ({
        id: chat.id,
        title: chat.title,
        time: format(new Date(chat.created_at), 'h:mm a'),
        createdAt: chat.created_at
      }));
      
      const groupedChats = groupChatsByDate(formattedChats);
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
      const { data, error } = await supabase
        .from('chat_history')
        .insert([{ 
          title, 
          user_id: user.id 
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setCurrentChatId(data.id);
      setCurrentChatMessages([]);
      fetchChatHistory();
      return data.id;
    } catch (error) {
      console.error('Error creating chat:', error);
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
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const formattedMessages: ChatMessage[] = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.is_user,
        keywords: msg.keywords || [],
        summary: msg.summary || [],
        followUps: msg.follow_ups || [],
        createdAt: msg.created_at
      }));
      
      setCurrentChatMessages(formattedMessages);
      return formattedMessages;
    } catch (error) {
      console.error('Error loading chat session:', error);
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
    
    let chatId = currentChatId;
    
    if (!chatId) {
      const chatTitle = message.isUser ? message.content.substring(0, 30) : 'New Chat';
      chatId = await createNewChat(chatTitle);
      if (!chatId) return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          chat_id: chatId,
          content: message.content,
          is_user: message.isUser,
          keywords: message.keywords || [],
          summary: message.summary || [],
          follow_ups: message.followUps || []
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const newMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        isUser: data.is_user,
        keywords: data.keywords || [],
        summary: data.summary || [],
        followUps: data.follow_ups || [],
        createdAt: data.created_at
      };
      
      setCurrentChatMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
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
      const { error } = await supabase
        .from('chat_history')
        .update({ title: newTitle })
        .eq('id', chatId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      fetchChatHistory();
      return true;
    } catch (error) {
      console.error('Error updating chat title:', error);
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
      // First delete all messages in the chat
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('chat_id', chatId);
      
      if (messagesError) throw messagesError;
      
      // Then delete the chat
      const { error: chatError } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id);
      
      if (chatError) throw chatError;
      
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setCurrentChatMessages([]);
      }
      
      fetchChatHistory();
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
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
