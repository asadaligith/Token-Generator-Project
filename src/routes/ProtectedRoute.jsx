import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return !isLoggedIn ? children : <Navigate to="/home" replace />;
};

export const RoleRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, loading, userData } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.role === requiredRole) {
    return children;
  }

  // If user has no role yet (and we're not loading), send them to home to pick one
  if (!userData?.role) {
    return <Navigate to="/home" replace />;
  }

  // If user has a different role, send them to home (which will redirect to their correct dashboard)
  return <Navigate to="/home" replace />;
};
