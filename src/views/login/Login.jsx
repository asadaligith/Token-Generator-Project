import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { handleFacebookLogin } from '../../firebase/auth.js';
import { FaFacebook } from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await handleFacebookLogin();
      if (result) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Token Manager</h1>
          <p className="text-gray-600">Manage tokens efficiently</p>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-center text-gray-700 font-semibold">
            Sign in to continue
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaFacebook size={20} />
          {loading ? 'Logging in...' : 'Login with Facebook'}
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          By logging in, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default Login;


