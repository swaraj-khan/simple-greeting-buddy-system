
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useHandleOAuthRedirect = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleOAuthRedirect = async () => {
    const url = window.location.href;
    console.log('Checking for OAuth redirect in URL:', url);
    
    if (url.includes('#access_token') || url.includes('?code=')) {
      console.log('OAuth redirect detected');
      
      try {
        console.log('Getting session from Supabase...');
        const { data, error } = await supabase.auth.getSession();
        console.log('Session data:', data);
        
        if (error) {
          console.error('Authentication error:', error);
          toast({
            title: "Authentication Failed",
            description: error.message,
            variant: "destructive",
          });
          return false;
        } else {
          // Session will be picked up by the auth listener
          toast({
            title: "Success",
            description: "You have successfully signed in",
          });
          
          // Clear URL parameters
          if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          // Navigate to the redirect URL or home page
          const redirectTo = searchParams.get('redirectTo') || '/';
          navigate(redirectTo);
          return true;
        }
      } catch (error) {
        console.error('Error handling OAuth redirect:', error);
        toast({
          title: "Authentication Failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        return false;
      }
    } else {
      console.log('No OAuth redirect detected in URL');
      return false;
    }
  };

  return { handleOAuthRedirect };
};
