import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { updateUserRole } from '../../services/db.js';
import { FaBuilding, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { handleLogout } from '../../firebase/auth.js';

function Home() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role) => {
    try {
      setLoading(true);
      await updateUserRole(user.uid, role);
      
      // Navigate based on role
      if (role === 'company') {
        navigate('/company/dashboard');
      } else if (role === 'user') {
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Error setting role:', error);
      alert('Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // If user already has a role, redirect
  if (userData?.role) {
    if (userData.role === 'company') {
      navigate('/company/dashboard');
    } else if (userData.role === 'user') {
      navigate('/user/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">Token Manager</h1>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome, {user?.displayName}!
          </h2>
          <p className="text-xl text-gray-600">
            Choose your role to get started
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Company Card */}
          <button
            onClick={() => handleRoleSelection('company')}
            disabled={loading}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <FaBuilding className="text-6xl text-indigo-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Are you a company?
              </h3>
              <p className="text-gray-600 mb-6">
                Manage your tokens and patient queue
              </p>
              <span className="text-indigo-600 font-semibold">
                {loading ? 'Loading...' : 'Continue →'}
              </span>
            </div>
          </button>

          {/* User Card */}
          <button
            onClick={() => handleRoleSelection('user')}
            disabled={loading}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <FaUser className="text-6xl text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Finding/Waiting for Tokens?
              </h3>
              <p className="text-gray-600 mb-6">
                Search and book tokens from companies
              </p>
              <span className="text-green-600 font-semibold">
                {loading ? 'Loading...' : 'Continue →'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
