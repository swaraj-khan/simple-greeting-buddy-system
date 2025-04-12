
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    // For testing, check hardcoded credentials
    if (email === 'dev@draconic.ai' && password === 'babydragon') {
      return { success: true, hardcodedUser: true, email };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { success: false };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false };
  }
};

export const loginWithGoogle = async () => {
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

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    toast({
      title: "Logout Failed",
      description: "An error occurred while signing out",
      variant: "destructive",
    });
    return false;
  }
};
