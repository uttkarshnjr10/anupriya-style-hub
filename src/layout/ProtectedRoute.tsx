import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRole?: 'owner' | 'staff';
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // --- FIX: Normalize comparison here too ---
  const userRole = user.role.toLowerCase();
  const requiredRole = allowedRole?.toLowerCase();

  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'owner') return <Navigate to="/owner" replace />;
    if (userRole === 'staff') return <Navigate to="/staff" replace />;
  }
  // ------------------------------------------

  return <Outlet />;
};

export default ProtectedRoute;