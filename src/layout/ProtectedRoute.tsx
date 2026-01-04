import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'owner' | 'staff';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  // We'll use a simple local check or rely on the API failure to redirect.
  // Ideally, you'd check a global AuthContext here.
  
  // For now, we render the children. 
  // If the API calls inside fail with 401, src/lib/api.ts will redirect to /login.
  // This wrapper is mainly for Role-based logic we might add later.
  
  return <>{children}</>;
};

export default ProtectedRoute;