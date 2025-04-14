
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

/**
 * Fetches a user's profile data from the profiles table
 */
export const getUserProfile = async (userId: string) => {
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

/**
 * Signs in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log("Attempting login for:", email);
    
    // For testing, check hardcoded credentials
    if (email === 'dev@draconic.ai' && password === 'babydragon') {
      console.log("Using hardcoded credentials for development");
      return true;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return false;
    }
    
    console.log("Login successful:", data.user?.email);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

/**
 * Signs in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<boolean> => {
  try {
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

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    console.log("Logging out user");
    await supabase.auth.signOut();
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
