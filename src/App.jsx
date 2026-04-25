import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute.jsx';

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

        {/* Unified Dashboard Routes */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/company/:companyId"
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
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

