import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/ui/AuthContext';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location to redirect back after login
    return (
      <Navigate
        to={createPageUrl('Login')}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== 'admin') {
    // Redirect non-admin users to home
    return <Navigate to={createPageUrl('Home')} replace />;
  }

  // User is authenticated (and admin if required)
  return children;
}

