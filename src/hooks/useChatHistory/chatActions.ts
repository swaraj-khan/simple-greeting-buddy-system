
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatSession } from './types';
import { useToast } from '@/hooks/use-toast';

// Create mock chat for development without auth
export const createMockChat = (title: string): ChatSession => {
  return {
    id: `mock-${Date.now()}`,
    title: title || 'New chat',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: []
  };
};

// Create a new chat session in Supabase
export const createSupabaseChat = async (userId: string, title: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        title: title || 'New chat'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      messages: []
    } as ChatSession;
  } catch (error) {
    console.error('Error creating chat:', error);
    return null;
  }
};

// Load messages for a specific chat
export const loadChatMessages = async (chatId: string) => {
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
    return [];
  }
};

// Save message to DB
export const saveSupabaseMessage = async (chatId: string, message: ChatMessage) => {
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
    console.error('Error saving message:', error);
    return null;
  }
};

// Update chat title
export const updateChatTitleInSupabase = async (chatId: string, title: string) => {
  try {
    const { error } = await supabase
      .from('chat_history')
      .update({ title })
      .eq('id', chatId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating chat title:', error);
    return false;
  }
};

// Delete a chat
export const deleteChatFromSupabase = async (chatId: string) => {
  try {
    // Delete the chat (cascade will handle messages)
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', chatId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
};

// Load all chats for a user
export const loadUserChats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
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
    
    return chatSessions;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};
