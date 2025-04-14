
import { format } from 'date-fns';
import { ChatSession, ChatHistoryGroup } from '@/types/chat';

// Get formatted date for grouping
export const getFormattedDate = (dateString: string) => {
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
export const groupChatsByDate = (chats: ChatSession[]): ChatHistoryGroup[] => {
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
