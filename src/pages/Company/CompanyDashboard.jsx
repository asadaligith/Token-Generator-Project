import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCompanies, getTodayTokens, getCompanyBookings, updateTokenStatus, createDailyTokens } from '../../services/db.js';
import { handleLogout } from '../../firebase/auth.js';
import CompanyCreationModal from '../../components/Company/CompanyCreationModal.jsx';
import { FaPlus, FaSignOutAlt, FaTimes, FaCheck } from 'react-icons/fa';
import TokenManagementPanel from '../../components/Company/TokenManagementPanel.jsx';

function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [todayTokens, setTodayTokens] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Redirect if not a company
    if (userData?.role !== 'company') {
      navigate('/home');
    }

    loadCompanies();
  }, [user, userData]);

  useEffect(() => {
    if (selectedCompany) {
      loadTokensAndBookings();
    }
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const companiesList = await getCompanies(user.uid);
      setCompanies(companiesList);
      if (companiesList.length > 0) {
        setSelectedCompany(companiesList[0]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      alert('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const loadTokensAndBookings = async () => {
    try {
      const tokens = await getTodayTokens(selectedCompany.id);
      setTodayTokens(tokens);

      const bookingsList = await getCompanyBookings(selectedCompany.id);
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error loading tokens and bookings:', error);
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

  const handleAddTokens = async () => {
    const totalTokens = prompt('Enter total tokens for today:', '50');
    const estimatedTime = prompt('Enter estimated time per token (in minutes):', '10');

    if (totalTokens && estimatedTime) {
      try {
        const tokenData = {
          companyId: selectedCompany.id,
          totalTokens: parseInt(totalTokens),
          estimatedTimePerToken: parseInt(estimatedTime),
        };
        
        const tokenId = await createDailyTokens(tokenData);
        setTodayTokens({ id: tokenId, ...tokenData, currentToken: 0 });
        alert('Tokens added successfully!');
      } catch (error) {
        console.error('Error adding tokens:', error);
        alert('Failed to add tokens');
      }
    }
  };

  const handleMarkDone = async (bookingId) => {
    try {
      await updateTokenStatus(bookingId, { status: 'done' });
      // Increment current token
      if (todayTokens) {
        await updateTokenStatus(todayTokens.id, { 
          currentToken: (todayTokens.currentToken || 0) + 1 
        });
      }
      loadTokensAndBookings();
    } catch (error) {
      console.error('Error marking booking as done:', error);
      alert('Failed to mark as done');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">Company Dashboard</h1>
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
          {/* Sidebar - Companies */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Companies</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                  title="Add new company"
                >
                  <FaPlus />
                </button>
              </div>

              <div className="space-y-2">
                {companies.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No companies yet. Create one!
                  </p>
                ) : (
                  companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => setSelectedCompany(company)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedCompany?.id === company.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <p className="font-semibold">{company.name}</p>
                      <p className="text-sm opacity-75">Since {company.since}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCompany ? (
              <div className="space-y-6">
                {/* Company Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedCompany.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Since</p>
                      <p className="text-lg font-semibold">{selectedCompany.since}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Timings</p>
                      <p className="text-lg font-semibold">{selectedCompany.timings}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Location</p>
                      <p className="text-lg font-semibold">{selectedCompany.address?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Token Management */}
                <TokenManagementPanel
                  company={selectedCompany}
                  todayTokens={todayTokens}
                  bookings={bookings}
                  onAddTokens={handleAddTokens}
                  onMarkDone={handleMarkDone}
                  onRefresh={loadTokensAndBookings}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No company selected</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
                >
                  <FaPlus /> Create First Company
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Creation Modal */}
      <CompanyCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCompanies}
      />
    </div>
  );
}

export default CompanyDashboard;
