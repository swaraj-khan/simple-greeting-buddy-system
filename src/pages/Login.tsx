
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import AuthLinks from '@/components/auth/AuthLinks';
import { useHandleOAuthRedirect } from '@/utils/authRedirectUtils';

export default function Login() {
  const { user } = useAuth();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const { handleOAuthRedirect } = useHandleOAuthRedirect();
  
  // Debug information
  useEffect(() => {
    console.log('Current URL:', window.location.href);
    console.log('Origin:', window.location.origin);
  }, []);

  // Handle OAuth redirect
  useEffect(() => {
    const processOAuth = async () => {
      setIsProcessingOAuth(true);
      const result = await handleOAuthRedirect();
      if (!result) {
        setIsProcessingOAuth(false);
      }
    };

    processOAuth();
  }, [handleOAuthRedirect]);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center honeycomb-bg main-honeycomb-glow overflow-hidden p-4">
      <div className="w-full max-w-md px-6 py-8 bg-secondary/60 backdrop-blur-md rounded-xl border border-border shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/55efddea-3c93-4ddd-ac9b-dbfa1c6a12c2.png" 
            alt="Draconic Logo" 
            className="h-20 mb-4 object-contain"
          />
        </div>

        {isProcessingOAuth ? (
          <div className="flex flex-col items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">Processing your sign-in...</p>
          </div>
        ) : (
          <>
            <LoginForm />
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-secondary px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <GoogleLoginButton disabled={isProcessingOAuth} />
            
            <AuthLinks />
          </>
        )}
      </div>
    </div>
  );
}
