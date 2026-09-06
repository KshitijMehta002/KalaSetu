import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D97706]" />
        <p className="mt-4 text-sm font-medium text-[#78716C] dark:text-[#A8A29E]">Loading your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If artisan tries to access admin or customer tries to access artisan, redirect
    if (user.role === 'artisan') {
      return <Navigate to="/artisan/dashboard" replace />;
    }
    return <Navigate to="/marketplace" replace />;
  }

  return children;
};

export default ProtectedRoute;
