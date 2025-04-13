
import React from 'react';
import { CalendarDays, MessageSquare } from 'lucide-react';
import { Separator } from './ui/separator';

// Mock data for chat history
// In a real application, this would come from a database or API
const mockChatHistory = [
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

export const HistorySidebar = () => {
  return (
    <div className="h-full pt-4 overflow-y-auto">
      {mockChatHistory.map((group) => (
        <div key={group.date} className="mb-6">
          <div className="flex items-center gap-2 px-4 mb-2">
            <CalendarDays size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">{group.date}</h3>
          </div>
          
          <div className="space-y-1">
            {group.chats.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left px-4 py-3 flex items-start hover:bg-accent rounded-md transition-colors group"
              >
                <MessageSquare size={16} className="mt-0.5 mr-3 text-muted-foreground group-hover:text-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-foreground">
                    {chat.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {chat.time}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <Separator className="mt-4 mb-4" />
        </div>
      ))}
      
      <div className="px-4 py-3 mt-auto">
        <p className="text-xs text-center text-muted-foreground">
          Your conversations are saved for 30 days
        </p>
      </div>
    </div>
  );
};
