
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
    
    // Check if we have a hash or code in the URL (signs of a redirect)
    if (url.includes('#access_token') || url.includes('?code=') || url.includes('#error=')) {
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
        } 
        
        // If we have session data, it means authentication was successful
        if (data.session) {
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
        } else {
          // This case happens when there's an error in the hash but no session
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1) // Remove the # character
          );
          const errorMessage = hashParams.get('error_description') || 'Authentication failed';
          console.error('Authentication error from hash:', errorMessage);
          toast({
            title: "Authentication Failed",
            description: errorMessage,
            variant: "destructive",
          });
          // Clean up the URL
          if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          return false;
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
