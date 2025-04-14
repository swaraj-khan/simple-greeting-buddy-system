
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ChatSession, ChatMessage } from '@/types/chat';
import { groupChatsByDate } from '@/utils/chatUtils';

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
    console.error('Error fetching chat history:', error);
    throw error;
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
    console.error('Error creating chat:', error);
    throw error;
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
    console.error('Error loading chat session:', error);
    throw error;
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
    
    if (!targetChatId) {
      const chatTitle = message.isUser ? message.content.substring(0, 30) : 'New Chat';
      targetChatId = await createNewChatForUser(userId, chatTitle);
      if (!targetChatId) return null;
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
    console.error('Error adding message:', error);
    throw error;
  }
};

// Update chat title
export const updateChatTitle = async (userId: string, chatId: string, newTitle: string) => {
  if (!userId || !chatId) return false;
  
  try {
    const { error } = await supabase
      .from('chat_history')
      .update({ title: newTitle })
      .eq('id', chatId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating chat title:', error);
    throw error;
  }
};

// Delete chat
export const deleteChat = async (userId: string, chatId: string) => {
  if (!userId || !chatId) return false;
  
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
      .eq('user_id', userId);
    
    if (chatError) throw chatError;
    
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};
