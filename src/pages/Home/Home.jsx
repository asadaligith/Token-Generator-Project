import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { updateUserRole } from '../../services/db.js';
import { FaBuilding, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { handleLogout } from '../../firebase/auth.js';

function Home() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);

  // No redirect logic needed - user can choose either dashboard from Home
  useEffect(() => {
    console.log('Home loaded, user:', user?.displayName);
  }, [user]);

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Company Card */}
          <button
            onClick={() => handleNavigate('/company/dashboard')}
            className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition transform hover:-translate-y-2 border-b-8 border-indigo-600 group"
          >
            <div className="text-center">
              <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition">
                <FaBuilding className="text-5xl text-indigo-600" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-800 mb-4">
                Company Portal
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Register your company, manage token limits, and view your patient queue.
              </p>
              <span className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition">
                Manage My Business
              </span>
            </div>
          </button>

          {/* User Card */}
          <button
            onClick={() => handleNavigate('/user/dashboard')}
            className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition transform hover:-translate-y-2 border-b-8 border-green-500 group"
          >
            <div className="text-center">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition">
                <FaUser className="text-5xl text-green-600" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-800 mb-4">
                User Portal
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Search for nearby clinics/offices, check wait times, and book your tokens.
              </p>
              <span className="inline-block bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-600 transition">
                Book a Token
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
