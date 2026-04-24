import React, { useState, useEffect } from 'react';
import { updateBookingStatus, updateTokenSettings, getUsersInfo } from '../../services/db.js';
import { FaPlus, FaCheck, FaTimes, FaClock, FaUser, FaInfoCircle, FaPowerOff } from 'react-icons/fa';

function TokenManagementPanel({ company, todayTokens, bookings, onAddTokens, onMarkDone, onRefresh }) {
  const [waitingBookings, setWaitingBookings] = useState([]);
  const [doneBookings, setDoneBookings] = useState([]);
  const [users, setUsers] = useState({});
  const [editingSettings, setEditingSettings] = useState(false);
  const [newSettings, setNewSettings] = useState({
    totalTokens: todayTokens?.totalTokens || 0,
    estimatedTimePerToken: todayTokens?.estimatedTimePerToken || 0
  });

  useEffect(() => {
    if (todayTokens) {
      setNewSettings({
        totalTokens: todayTokens.totalTokens,
        estimatedTimePerToken: todayTokens.estimatedTimePerToken
      });
    }
  }, [todayTokens]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter((b) => b.date === today);
    
    setWaitingBookings(todayBookings.filter((b) => b.status === 'waiting'));
    setDoneBookings(todayBookings.filter((b) => b.status === 'done'));

    // Fetch user info for all bookings
    const uids = todayBookings.map(b => b.userId);
    if (uids.length > 0) {
      getUsersInfo(uids).then(setUsers);
    }
  }, [bookings]);

  const calculateEstimatedWaitTime = (position) => {
    if (!todayTokens) return 'N/A';
    const timePerToken = todayTokens.estimatedTimePerToken || 10;
    const waitTime = (position - (todayTokens.currentToken || 0)) * timePerToken;
    return waitTime > 0 ? `${waitTime} min` : 'Soon';
  };

  const handleMarkDone = async (bookingId, index) => {
    try {
      await updateBookingStatus(bookingId, 'done');
      onMarkDone?.(bookingId);
      onRefresh?.();
    } catch (error) {
      console.error('Error marking booking as done:', error);
      alert('Failed to mark as done');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingStatus(bookingId, 'cancelled');
        onRefresh?.();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateTokenSettings(todayTokens.id, newSettings);
      setEditingSettings(false);
      onRefresh?.();
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  const handleToggleActive = async () => {
    try {
      await updateTokenSettings(todayTokens.id, { isActive: !todayTokens.isActive });
      onRefresh?.();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Token Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Today's Tokens</h3>
          {!todayTokens && (
            <button
              onClick={onAddTokens}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <FaPlus /> Add Tokens
            </button>
          )}
        </div>

        {todayTokens ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-600 text-sm font-semibold mb-1">Total Tokens</p>
                <p className="text-3xl font-bold text-blue-700">{todayTokens.totalTokens}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-600 text-sm font-semibold mb-1">Current Token</p>
                <p className="text-3xl font-bold text-green-700">{todayTokens.currentToken || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-purple-600 text-sm font-semibold mb-1">Time/Token</p>
                <p className="text-3xl font-bold text-purple-700">{todayTokens.estimatedTimePerToken} min</p>
              </div>
              <div className={`p-4 rounded-lg border ${todayTokens.isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`${todayTokens.isActive ? 'text-green-600' : 'text-red-600'} text-sm font-semibold mb-1`}>Status</p>
                <p className={`text-xl font-bold ${todayTokens.isActive ? 'text-green-700' : 'text-red-700'}`}>
                  {todayTokens.isActive ? 'Active' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setEditingSettings(!editingSettings)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                <FaInfoCircle /> {editingSettings ? 'Cancel Edit' : 'Edit Settings'}
              </button>
              <button
                onClick={handleToggleActive}
                className={`${todayTokens.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
              >
                <FaPowerOff /> {todayTokens.isActive ? 'Disallow Tokens' : 'Allow Tokens'}
              </button>
            </div>

            {editingSettings && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Tokens Limit</label>
                    <input
                      type="number"
                      value={newSettings.totalTokens}
                      onChange={(e) => setNewSettings({...newSettings, totalTokens: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Est. Time per Token (min)</label>
                    <input
                      type="number"
                      value={newSettings.estimatedTimePerToken}
                      onChange={(e) => setNewSettings({...newSettings, estimatedTimePerToken: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateSettings}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
            <p className="mb-4">No tokens created for today</p>
            <button
              onClick={onAddTokens}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-2"
            >
              <FaPlus /> Create Tokens
            </button>
          </div>
        )}
      </div>

      {/* Queue Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waiting Queue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaClock className="text-yellow-500" /> Waiting ({waitingBookings.length})
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {waitingBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No waiting bookings</p>
            ) : (
              waitingBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex justify-between items-center"
                >
                  <div className="flex-1 flex gap-4">
                    {users[booking.userId]?.picture ? (
                      <img src={users[booking.userId].picture} alt="" className="w-12 h-12 rounded-full border" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        Token #{booking.tokenNumber}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {users[booking.userId]?.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {users[booking.userId]?.email || ''}
                      </p>
                      {booking.patientImage && (
                        <a href={booking.patientImage} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1">
                          <FaImage /> View Patient Image
                        </a>
                      )}
                      <p className="text-sm text-yellow-700 font-semibold mt-1">
                        Wait: {calculateEstimatedWaitTime(booking.tokenNumber)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkDone(booking.id, index)}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                    title="Mark as done"
                  >
                    <FaCheck />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Queue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCheck className="text-green-500" /> Completed ({doneBookings.length})
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {doneBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No completed bookings</p>
            ) : (
              doneBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-green-50 border-l-4 border-green-400 p-4 rounded"
                >
                  <p className="font-bold text-lg text-gray-800">
                    Token #{booking.tokenNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.userId || 'Anonymous'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">All Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Token #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-800">
                      #{booking.tokenNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {booking.userId || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'done'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'waiting'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {booking.status === 'waiting' && (
                        <>
                          <button
                            onClick={() => handleMarkDone(booking.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm flex items-center gap-1"
                          >
                            <FaCheck size={12} /> Done
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm flex items-center gap-1"
                          >
                            <FaTimes size={12} /> Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TokenManagementPanel;
