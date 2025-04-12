
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error };
  }
};

export const loginWithGoogle = async () => {
  try {
    // Log the current URL to help with debugging
    const currentUrl = window.location.origin;
    console.log('Current URL for redirect:', currentUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${currentUrl}/login`, // Use current origin for proper redirect
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    if (error) {
      console.error('Google login error:', error);
      return false;
    }
    
    // No need to show a toast here as user will be redirected to Google
    return true;
  } catch (error) {
    console.error('Google login error:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};
