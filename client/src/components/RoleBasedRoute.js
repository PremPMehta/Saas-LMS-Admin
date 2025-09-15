import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles = ['admin'], fallbackPath = '/academies' }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If user has no role, treat as regular user
  const userRole = user?.role || 'user';

  // Check if user's role is allowed
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    // Redirect to appropriate page based on user role instead of showing access denied
    let redirectPath = '/academies'; // Default for regular users
    
    if (userRole === 'admin') {
      redirectPath = '/discovery'; // Admin users go to courses page
    }
    
    // Use the provided fallbackPath if it's accessible to the user
    if (fallbackPath && (userRole === 'admin' || fallbackPath === '/academies' || fallbackPath === '/plans' || fallbackPath === '/profile')) {
      redirectPath = fallbackPath;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleBasedRoute; 