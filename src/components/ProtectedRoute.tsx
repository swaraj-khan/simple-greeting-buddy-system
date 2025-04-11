
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // While checking authentication status, we can show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in, render the protected content
  return <Outlet />;
}
