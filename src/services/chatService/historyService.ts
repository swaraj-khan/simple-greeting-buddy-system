
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ChatSession } from '@/types/chat';
import { groupChatsByDate } from '@/utils/chatUtils';
import { handleServiceError } from './errorHandler';

/**
 * Fetch chat history for a specific user
 */
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

/**
 * Create new chat for a user
 */
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

/**
 * Update chat title
 */
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

/**
 * Delete chat and its associated messages
 */
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
