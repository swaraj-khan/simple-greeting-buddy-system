
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useUserProfile, UserProfile } from '@/hooks/useUserProfile';
import { loginWithEmailPassword, loginWithGoogle as authLoginWithGoogle, logout as authLogout } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession ? 'session exists' : 'no session');
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Defer profile fetching to avoid deadlock
          setTimeout(async () => {
            try {
              const profile = await getUserProfile(currentSession.user.id);
              
              // Combine user with profile data
              const userWithProfile = {
                ...currentSession.user,
                profile: profile || undefined
              };
              
              setUser(userWithProfile);
            } catch (err) {
              console.error('Error fetching profile:', err);
              // Still set the user even if profile fetch fails
              setUser(currentSession.user as UserWithProfile);
            }
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          console.log('Session found for user:', currentSession.user.email);
          
          // Defer profile fetching
          setTimeout(async () => {
            try {
              const profile = await getUserProfile(currentSession.user.id);
              
              // Combine user with profile data
              const userWithProfile = {
                ...currentSession.user,
                profile: profile || undefined
              };
              
              setUser(userWithProfile);
              setSession(currentSession);
            } catch (err) {
              console.error('Error fetching profile:', err);
              // Still set the user even if profile fetch fails
              setUser(currentSession.user as UserWithProfile);
              setSession(currentSession);
            }
            setIsLoading(false);
          }, 0);
        } else {
          console.log('No session found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
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
        toast({
          title: "Login Failed",
          description: result.error?.message || "Invalid email or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      if (result.hardcodedUser) {
        const hardcodedUser = { 
          email, 
          id: 'dev-user',
          profile: {
            full_name: 'Abhinandan',
            username: 'abhinandan'
          }
        } as UserWithProfile;
        setUser(hardcodedUser);
        
        toast({
          title: "Success",
          description: "You have successfully signed in",
        });
      }
      // For non-hardcoded users, the auth listener will handle setting the user
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authLoginWithGoogle();
      if (!result) {
        setIsLoading(false);
      }
      return result;
    } catch (error) {
      console.error('Google login error:', error);
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
      toast({
        title: "Logout Failed",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
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
