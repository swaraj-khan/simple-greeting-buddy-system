
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useUserProfile, UserProfile } from '@/hooks/useUserProfile';
import { loginWithEmailPassword, loginWithGoogle, logout as authLogout } from '@/services/authService';

export type UserWithProfile = User & {
  profile?: UserProfile;
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
  const { getUserProfile } = useUserProfile();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          const profile = await getUserProfile(currentSession.user.id);
          
          // Combine user with profile data
          const userWithProfile = {
            ...currentSession.user,
            profile: profile || undefined
          };
          
          setUser(userWithProfile);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        const profile = await getUserProfile(currentSession.user.id);
        
        // Combine user with profile data
        const userWithProfile = {
          ...currentSession.user,
          profile: profile || undefined
        };
        
        setUser(userWithProfile);
        setSession(currentSession);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await loginWithEmailPassword(email, password);
      
      if (!result.success) {
        setIsLoading(false);
        return false;
      }
      
      if (result.hardcodedUser) {
        const user = { 
          email, 
          profile: {
            full_name: 'Abhinandan',
            username: 'abhinandan'
          }
        } as UserWithProfile;
        setUser(user);
      }
      
      // For non-hardcoded users, the auth listener will handle setting the user
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authLogout();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      loginWithGoogle, 
      logout, 
      isLoading 
    }}>
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
