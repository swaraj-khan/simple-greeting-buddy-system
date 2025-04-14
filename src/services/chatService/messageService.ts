
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';
import { handleServiceError } from './errorHandler';
import { createNewChatForUser } from './historyService';

/**
 * Load messages for a specific chat session
 */
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

/**
 * Add a new message to a chat
 */
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
    
    const newMessage: ChatMessage = {
      id: data.id,
      content: data.content,
      isUser: data.is_user,
      keywords: data.keywords || [],
      summary: data.summary || [],
      followUps: data.follow_ups || [],
      createdAt: data.created_at
    };
    
    return newMessage;
  } catch (error) {
    handleServiceError(error, 'add message to chat');
  }
};
