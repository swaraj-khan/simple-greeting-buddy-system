
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { signInWithEmail, signInWithGoogle, signOut } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("Setting up auth state listener");

    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      console.log("Initializing auth state");
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        console.log("Found existing session for user:", currentSession.user.email);
        setUser(currentSession.user);
        setSession(currentSession);
      } else {
        console.log("No existing session found");
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For development purposes, check hardcoded credentials
      if (email === 'dev@draconic.ai' && password === 'babydragon') {
        console.log("Using hardcoded credentials for development");
        const mockUser = { 
          id: 'dev-user-id',
          email,
        } as User;
        
        setUser(mockUser);
        
        // Create a mock session
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          user: mockUser,
          expires_at: Date.now() + 3600 * 1000,
        } as Session;
        
        setSession(mockSession);
        
        setIsLoading(false);
        return true;
      }
      
      const success = await signInWithEmail(email, password);
      setIsLoading(false);
      return success;
    } catch (error) {
      console.error('Login error in context:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    return signInWithGoogle();
  };

  const logout = async (): Promise<void> => {
    await signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
