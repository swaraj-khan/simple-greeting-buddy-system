
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

type UserWithProfile = User & {
  profile?: {
    full_name: string;
    username: string;
    avatar_url?: string;
  }
};

interface AuthContextType {
  user: UserWithProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user profile data
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("Setting up auth state listener");

    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log("User authenticated:", currentSession.user.email);
          const profile = await getUserProfile(currentSession.user.id);
          
          // Combine user with profile data
          const userWithProfile = {
            ...currentSession.user,
            profile: profile || undefined
          };
          
          setUser(userWithProfile);
        } else {
          console.log("No user in session");
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      console.log("Initializing auth state");
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        console.log("Found existing session for user:", currentSession.user.email);
        const profile = await getUserProfile(currentSession.user.id);
        
        // Combine user with profile data
        const userWithProfile = {
          ...currentSession.user,
          profile: profile || undefined
        };
        
        setUser(userWithProfile);
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
      console.log("Attempting login for:", email);
      
      // For testing, check hardcoded credentials
      if (email === 'dev@draconic.ai' && password === 'babydragon') {
        console.log("Using hardcoded credentials for development");
        const mockUser = { 
          id: 'dev-user-id',
          email, 
          profile: {
            full_name: 'Abhinandan',
            username: 'abhinandan'
          }
        } as UserWithProfile;
        
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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }
      
      console.log("Login successful:", data.user?.email);
      // Profile data will be fetched by the auth listener
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Log the current URL to help with debugging
      console.log('Current URL:', window.location.origin);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Google login error:', error);
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      // We don't set user here because the redirect will happen
      // and onAuthStateChange will handle it after redirect
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("Logging out user");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log("User logged out");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
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
