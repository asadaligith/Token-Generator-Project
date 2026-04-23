import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute, PublicRoute, RoleRoute } from './routes/ProtectedRoute.jsx';

// Pages
import Login from './views/login/Login.jsx';
import Home from './pages/Home/Home.jsx';
import CompanyDashboard from './pages/Company/CompanyDashboard.jsx';
import UserDashboard from './pages/User/UserDashboard.jsx';
import CompanyDetails from './pages/User/CompanyDetails.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="/company/dashboard"
          element={
            <RoleRoute requiredRole="company">
              <CompanyDashboard />
            </RoleRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <RoleRoute requiredRole="user">
              <UserDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/user/company/:companyId"
          element={
            <RoleRoute requiredRole="user">
              <CompanyDetails />
            </RoleRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

