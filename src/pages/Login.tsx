
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { user, login, loginWithGoogle, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Debug information
  useEffect(() => {
    console.log('Current URL:', window.location.href);
    console.log('Origin:', window.location.origin);
  }, []);

  // Handle OAuth redirect
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const url = window.location.href;
      console.log('Checking for OAuth redirect in URL:', url);
      
      if (url.includes('#access_token') || url.includes('?code=')) {
        console.log('OAuth redirect detected');
        setIsProcessingOAuth(true);
        
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
            
            navigate('/');
          }
        } catch (error) {
          console.error('Error handling OAuth redirect:', error);
          toast({
            title: "Authentication Failed",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        } finally {
          setIsProcessingOAuth(false);
        }
      } else {
        console.log('No OAuth redirect detected in URL');
      }
    };

    handleOAuthRedirect();
  }, [toast, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await login(values.email, values.password);
      if (!success) {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Starting Google login process...');
    await loginWithGoogle();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            {...field} 
                            disabled={isSubmitting}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={togglePasswordVisibility}
                            className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Signing In
                    </>
                  ) : "Sign In"}
                </Button>
              </form>
            </Form>
            
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
            
            <Button 
              variant="outline" 
              className="w-full mb-4 bg-background/30"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || isLoading}
            >
              <svg 
                className="mr-2 h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 48 48"
              >
                <path 
                  fill="#FFC107" 
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path 
                  fill="#FF3D00" 
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path 
                  fill="#4CAF50" 
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path 
                  fill="#1976D2" 
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign in with Google
            </Button>
            
            <div className="flex flex-col items-center mt-4 text-sm text-center">
              <a 
                href="/register" 
                className="text-primary hover:underline mb-2"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Registration",
                    description: "Registration feature coming soon!",
                  });
                }}
              >
                Don't have an account? Register
              </a>
              <a 
                href="/forgot-password" 
                className="text-muted-foreground hover:text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Password Reset",
                    description: "Password reset feature coming soon!",
                  });
                }}
              >
                Forgot your password?
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
