
import React from 'react';
import { mockChatHistory } from '@/data/chatHistoryData';
import { ChatHistoryGroup } from './history/ChatHistoryGroup';
import { ChatHistoryFooter } from './history/ChatHistoryFooter';

export const HistorySidebar = () => {
  return (
    <div className="h-full pt-4 overflow-y-auto">
      {mockChatHistory.map((group) => (
        <ChatHistoryGroup key={group.date} group={group} />
      ))}
      
      <ChatHistoryFooter />
    </div>
  );
};
