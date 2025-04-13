
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChatHistoryFooter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="px-4 py-3 mt-auto">
        <p className="text-xs text-center text-muted-foreground mb-2">
          Sign in to save your conversations
        </p>
        <Button variant="outline" asChild className="w-full">
          <Link to="/login" className="flex items-center justify-center gap-2">
            <LogIn size={16} />
            Sign In
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-3 mt-auto">
      <p className="text-xs text-center text-muted-foreground">
        Your conversations are saved securely
      </p>
    </div>
  );
};
