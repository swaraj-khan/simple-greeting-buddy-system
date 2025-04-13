
// Mock data for chat history
// In a real application, this would come from a database or API
export interface ChatItem {
  id: number;
  title: string;
  time: string;
}

export interface ChatHistoryGroup {
  date: string;
  chats: ChatItem[];
}

export const mockChatHistory: ChatHistoryGroup[] = [
  {
    date: 'Today',
    chats: [
      { id: 1, title: 'Market analysis for tech stocks', time: '2:30 PM' },
      { id: 2, title: 'Explaining quantum computing', time: '11:45 AM' },
    ]
  },
  {
    date: 'Yesterday',
    chats: [
      { id: 3, title: 'Planning summer vacation', time: '7:15 PM' },
      { id: 4, title: 'Recipe for chocolate cake', time: '3:20 PM' },
    ]
  },
  {
    date: 'June 12, 2024',
    chats: [
      { id: 5, title: 'Financial investment strategies', time: '1:10 PM' },
      { id: 6, title: 'Writing a research paper', time: '10:05 AM' },
    ]
  }
];
