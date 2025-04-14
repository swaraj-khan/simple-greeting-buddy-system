
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ChatSession, ChatMessage } from '@/types/chat';
import { groupChatsByDate } from '@/utils/chatUtils';

// Error handling helper function
const handleServiceError = (error: any, operation: string): never => {
  console.error(`Error in chatService (${operation}):`, error);
  const errorMessage = error?.message || 'Unknown error occurred';
  const errorCode = error?.code || 'UNKNOWN_ERROR';
  
  throw {
    message: `Failed to ${operation}: ${errorMessage}`,
    code: errorCode,
    originalError: error
  };
};

// Fetch chat history for a user
export const fetchChatHistoryForUser = async (userId: string) => {
  if (!userId) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const formattedChats: ChatSession[] = data.map(chat => ({
      id: chat.id,
      title: chat.title,
      time: format(new Date(chat.created_at), 'h:mm a'),
      createdAt: chat.created_at
    }));
    
    return groupChatsByDate(formattedChats);
  } catch (error) {
    handleServiceError(error, 'fetch chat history');
  }
};

// Create new chat
export const createNewChatForUser = async (userId: string, title: string = 'New Chat') => {
  if (!userId) {
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert([{ 
        title, 
        user_id: userId 
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    handleServiceError(error, 'create new chat');
  }
};

// Load chat messages
export const loadChatSessionMessages = async (chatId: string) => {
  if (!chatId) return [];
  
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const formattedMessages: ChatMessage[] = data.map(msg => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.is_user,
      keywords: msg.keywords || [],
      summary: msg.summary || [],
      followUps: msg.follow_ups || [],
      createdAt: msg.created_at
    }));
    
    return formattedMessages;
  } catch (error) {
    handleServiceError(error, 'load chat messages');
  }
};

// Add message to chat
export const addMessageToChat = async (
  userId: string,
  chatId: string | null,
  message: Omit<ChatMessage, 'id' | 'createdAt'>
) => {
  if (!userId) {
    return null;
  }
  
  try {
    let targetChatId = chatId;
    
    // Create a new chat if there's no chatId
    if (!targetChatId) {
      const chatTitle = message.isUser ? message.content.substring(0, 30) : 'New Chat';
      targetChatId = await createNewChatForUser(userId, chatTitle);
      if (!targetChatId) {
        throw new Error('Failed to create a new chat');
      }
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        chat_id: targetChatId,
        content: message.content,
        is_user: message.isUser,
        keywords: message.keywords || [],
        summary: message.summary || [],
        follow_ups: message.followUps || []
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error('No data returned after inserting message');
    }
    
    return {
      id: data.id,
      content: data.content,
      isUser: data.is_user,
      keywords: data.keywords || [],
      summary: data.summary || [],
      followUps: data.follow_ups || [],
      createdAt: data.created_at
    } as ChatMessage;
  } catch (error) {
    handleServiceError(error, 'add message to chat');
  }
};

// Update chat title
export const updateChatTitle = async (userId: string, chatId: string, newTitle: string) => {
  if (!userId || !chatId || !newTitle || newTitle.trim() === '') {
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('chat_history')
      .update({ 
        title: newTitle.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    handleServiceError(error, 'update chat title');
  }
};

// Delete chat
export const deleteChat = async (userId: string, chatId: string) => {
  if (!userId || !chatId) return false;
  
  try {
    // Use a transaction to ensure all operations succeed or fail together
    const { data: chat, error: chatError } = await supabase
      .from('chat_history')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single();
    
    if (chatError) throw chatError;
    
    if (!chat) {
      throw new Error('Chat not found or you do not have permission to delete it');
    }
    
    // First delete all messages in the chat
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('chat_id', chatId);
    
    if (messagesError) throw messagesError;
    
    // Then delete the chat
    const { error: chatDeleteError } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', chatId)
      .eq('user_id', userId);
    
    if (chatDeleteError) throw chatDeleteError;
    
    return true;
  } catch (error) {
    handleServiceError(error, 'delete chat');
  }
};
