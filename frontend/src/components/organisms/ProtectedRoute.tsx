import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication and/or specific user roles.
 * Shows loading state during authentication check.
 * Redirects to home if not authenticated or lacks required role.
 * 
 * Follows Nielsen's Heuristics:
 * - Visibility of system status (loading indicator)
 * - Error prevention (role-based access control)
 * 
 * @component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Checking authentication..." variant="primary" />
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to home if user doesn't have required role
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


