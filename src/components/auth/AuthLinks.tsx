
import React from 'react';
import { useToast } from '@/hooks/use-toast';

const AuthLinks = () => {
  const { toast } = useToast();

  return (
    <div className="flex flex-col items-center mt-4 text-sm text-center">
      <a 
        href="/register" 
        className="text-primary hover:underline mb-2"
        onClick={(e) => {
          e.preventDefault();
          toast({
            title: "Registration",
            description: "Registration feature coming soon!",
          });
        }}
      >
        Don't have an account? Register
      </a>
      <a 
        href="/forgot-password" 
        className="text-muted-foreground hover:text-primary hover:underline"
        onClick={(e) => {
          e.preventDefault();
          toast({
            title: "Password Reset",
            description: "Password reset feature coming soon!",
          });
        }}
      >
        Forgot your password?
      </a>
    </div>
  );
};

export default AuthLinks;
