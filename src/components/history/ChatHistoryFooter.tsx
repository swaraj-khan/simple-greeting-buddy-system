
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const ChatHistoryFooter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  
  return (
    <div className="px-4 py-3 mt-auto">
      <p className="text-xs text-center text-muted-foreground">
        Your conversations are saved securely
      </p>
    </div>
  );
};
