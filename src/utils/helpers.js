// Utility functions for token management

export const calculateWaitTime = (tokenNumber, currentToken, estimatedTimePerToken) => {
  if (!estimatedTimePerToken || !currentToken) return 0;
  const waitMinutes = (tokenNumber - currentToken) * estimatedTimePerToken;
  return Math.max(0, waitMinutes);
};

export const formatWaitTime = (minutes) => {
  if (minutes === 0) return 'Available now';
  if (minutes < 1) return 'Less than 1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

export const getDateString = (date) => {
  return date.toISOString().split('T')[0];
};

export const isToday = (dateString) => {
  return dateString === getTodayDate();
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const getDaysUntilDate = (dateString) => {
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = Math.abs(targetDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const validateCompanyData = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Company name must be at least 3 characters';
  }

  if (!data.since || data.since < 1900 || data.since > new Date().getFullYear()) {
    errors.since = 'Invalid year';
  }

  if (!data.timings || data.timings.trim().length === 0) {
    errors.timings = 'Timings are required';
  }

  if (!data.address || !data.address.name) {
    errors.address = 'Address is required';
  }

  return errors;
};

export const validateTokenData = (data) => {
  const errors = {};

  if (!data.totalTokens || data.totalTokens < 1) {
    errors.totalTokens = 'Total tokens must be at least 1';
  }

  if (!data.estimatedTimePerToken || data.estimatedTimePerToken < 1) {
    errors.estimatedTimePerToken = 'Time per token must be at least 1 minute';
  }

  return errors;
};

export const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800';
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusBgColor = (status) => {
  switch (status) {
    case 'waiting':
      return 'bg-yellow-50 border-yellow-400';
    case 'done':
      return 'bg-green-50 border-green-400';
    case 'cancelled':
      return 'bg-red-50 border-red-400';
    default:
      return 'bg-gray-50 border-gray-400';
  }
};
