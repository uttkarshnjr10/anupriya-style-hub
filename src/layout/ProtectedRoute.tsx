import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRole?: 'owner' | 'staff';
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // 1. Wait for Auth Check to finish (prevents accidental redirects)
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // 2. Not Logged In? -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Wrong Role? -> Redirect to correct home
  if (allowedRole && user.role !== allowedRole) {
    // If Owner tries to go to Staff pages, send them to Owner Dashboard
    if (user.role === 'owner') return <Navigate to="/owner" replace />;
    // If Staff tries to go to Owner pages, send them to Staff Dashboard
    if (user.role === 'staff') return <Navigate to="/staff" replace />;
  }

  // 4. Everything OK -> Render Page
  return <Outlet />;
};

export default ProtectedRoute;