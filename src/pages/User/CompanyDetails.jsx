import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCompanyById, getTodayTokens, createBooking, subscribeToTokens } from '../../services/db.js';
import { uploadPatientImage } from '../../services/storage.js';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaImage } from 'react-icons/fa';

function CompanyDetails() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [company, setCompany] = useState(location.state?.company || null);
  const [todayTokens, setTodayTokens] = useState(null);
  const [loading, setLoading] = useState(!company);
  const [patientImage, setPatientImage] = useState(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadCompanyDetails();
  }, [companyId]);

  useEffect(() => {
    if (company) {
      loadTokens();
      
      // Subscribe to token updates
      const unsubscribe = subscribeToTokens(company.id, (tokens) => {
        const today = new Date().toISOString().split('T')[0];
        const todayToken = tokens.find((t) => t.date === today);
        setTodayTokens(todayToken || null);
      });

      return () => unsubscribe();
    }
  }, [company]);

  const loadCompanyDetails = async () => {
    if (!company) {
      try {
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
      } catch (error) {
        console.error('Error loading company:', error);
        alert('Failed to load company details');
        navigate('/user/dashboard');
      } finally {
        setLoading(false);
      }
    }
  };

  const loadTokens = async () => {
    try {
      const tokens = await getTodayTokens(company.id);
      setTodayTokens(tokens);
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  };

  const calculateEstimatedWaitTime = () => {
    if (!todayTokens) return 'N/A';
    const timePerToken = todayTokens.estimatedTimePerToken || 10;
    const waitTime = (todayTokens.totalTokens - (todayTokens.currentToken || 0)) * timePerToken;
    return waitTime > 0 ? `~${waitTime} min` : 'Available now';
  };

  const handleBookToken = async () => {
    if (!todayTokens) {
      alert('Company has not opened tokens for today');
      return;
    }

    if ((todayTokens.currentToken || 0) >= todayTokens.totalTokens) {
      alert('All tokens are booked for today');
      return;
    }

    try {
      setBooking(true);
      let patientImageUrl = '';

      if (patientImage) {
        patientImageUrl = await uploadPatientImage(patientImage, user.uid);
      }

      const bookingData = {
        companyId: company.id,
        userId: user.uid,
        patientImage: patientImageUrl,
      };

      const result = await createBooking(bookingData);
      alert(`Token booked successfully! Your token number is #${result.tokenNumber}`);
      
      // Reset form
      setPatientImage(null);
      
      // Navigate back or refresh
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Error booking token:', error);
      alert('Failed to book token');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Company not found</p>
      </div>
    );
  }

  const availableTokens = todayTokens
    ? Math.max(0, (todayTokens.totalTokens || 0) - (todayTokens.currentToken || 0))
    : 0;
  
  const canBook = availableTokens > 0 && (!todayTokens?.isActive || todayTokens.isActive === true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 text-2xl"
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-indigo-600">{company.name}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Company Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">ESTABLISHED</p>
              <p className="text-2xl font-bold text-gray-800">{company.since}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">TIMINGS</p>
              <p className="text-2xl font-bold text-gray-800">{company.timings}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-red-500 mt-1" />
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">LOCATION</p>
              <p className="text-lg text-gray-800">{company.address?.name || 'N/A'}</p>
            </div>
          </div>

          {/* Certificates */}
          {company.certificates && company.certificates.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm font-semibold mb-3">CERTIFICATES</p>
              <div className="grid grid-cols-3 gap-4">
                {company.certificates.map((cert, index) => (
                  <img
                    key={index}
                    src={cert}
                    alt={`Certificate ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Token Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUsers /> Today's Token Status
          </h2>

          {todayTokens ? (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-600 text-sm font-semibold mb-1">Total Tokens</p>
                <p className="text-3xl font-bold text-blue-700">{todayTokens.totalTokens}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-600 text-sm font-semibold mb-1">Current</p>
                <p className="text-3xl font-bold text-green-700">{todayTokens.currentToken || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-purple-600 text-sm font-semibold mb-1">Available</p>
                <p className="text-3xl font-bold text-purple-700">{availableTokens}</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-800">Company has not opened tokens for today yet.</p>
            </div>
          )}

          {todayTokens && (
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded flex items-center gap-3">
              <FaClock className="text-indigo-600" />
              <div>
                <p className="text-indigo-900 font-semibold">Estimated Wait Time</p>
                <p className="text-indigo-700">{calculateEstimatedWaitTime()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Booking Section */}
        {canBook && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Book a Token</h2>

            <div className="space-y-4">
              {/* Patient Image Upload */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <FaImage /> Patient Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPatientImage(e.target.files?.[0] || null)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={booking}
                />
                {patientImage && (
                  <p className="text-green-600 text-sm mt-2">
                    ✓ Image selected: {patientImage.name}
                  </p>
                )}
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookToken}
                disabled={booking}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? 'Booking...' : 'Book Token Now'}
              </button>

              <p className="text-gray-600 text-sm text-center">
                You will receive a token number and wait time notification
              </p>
            </div>
          </div>
        )}

        {!canBook && todayTokens && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-800 font-semibold">
              No tokens available for today. Please try again tomorrow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;
