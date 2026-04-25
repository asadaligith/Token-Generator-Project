import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAllCompanies, getUserBookings, cancelBooking, subscribeToTokens } from '../../services/db.js';
import { handleLogout } from '../../firebase/auth.js';
import { FaSearch, FaSignOutAlt, FaTicketAlt } from 'react-icons/fa';
import { requestNotificationPermission, checkAndNotify } from '../../services/notifications.js';

function UserDashboard() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
    requestNotificationPermission();
  }, [user]);

  // Set up listeners for notifications on waiting bookings
  useEffect(() => {
    if (!user || bookings.length === 0) return;

    const unsubscribers = [];
    const waiting = bookings.filter(b => b.status === 'waiting');

    waiting.forEach(booking => {
      const unsub = subscribeToTokens(booking.companyId, (tokens) => {
        const today = new Date().toISOString().split('T')[0];
        const todayToken = tokens.find(t => t.date === today);
        if (todayToken) {
          checkAndNotify(booking, todayToken);
        }
      });
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach(unsub => unsub());
  }, [user, bookings]);

  useEffect(() => {
    // Filter companies based on search term
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  const loadData = async () => {
    try {
      setLoading(true);
      const companiesList = await getAllCompanies();
      setCompanies(companiesList);

      const userBookingsList = await getUserBookings(user.uid);
      setBookings(userBookingsList);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
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

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        loadData();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const handleCompanyClick = (company) => {
    navigate(`/user/company/${company.id}`, { state: { company } });
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">User Dashboard</h1>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - My Bookings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTicketAlt /> My Bookings
              </h2>

              <div className="space-y-2">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No bookings yet
                  </p>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        booking.status === 'done'
                          ? 'bg-green-50 border-green-400'
                          : booking.status === 'waiting'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-red-50 border-red-400'
                      }`}
                    >
                      <p className="font-bold text-sm">Token #{booking.tokenNumber}</p>
                      <p className="text-xs text-gray-600">{booking.companyId}</p>
                      <p className={`text-xs font-semibold mt-1 ${
                        booking.status === 'done'
                          ? 'text-green-700'
                          : booking.status === 'waiting'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {booking.status.toUpperCase()}
                      </p>
                      {booking.status === 'waiting' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking.id);
                          }}
                          className="mt-2 text-xs text-red-600 hover:underline font-bold"
                        >
                          Cancel Token
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Companies */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCompanies.length === 0 ? (
                <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-600 text-lg">
                    {searchTerm ? 'No companies found' : 'No companies available'}
                  </p>
                </div>
              ) : (
                filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleCompanyClick(company)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 p-6 text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {company.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {company.address?.name || 'Location not specified'}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Since</p>
                        <p className="font-semibold text-gray-800">{company.since}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Timings</p>
                        <p className="font-semibold text-gray-800">{company.timings}</p>
                      </div>
                    </div>
                    <p className="text-indigo-600 font-semibold hover:underline">
                      View Details →
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
