import { apiUrl } from '../config/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('communityToken');
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const fullUrl = apiUrl(endpoint);
    console.log('🔍 API Call URL:', fullUrl); // Debug log
    const response = await fetch(fullUrl, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Community Authentication API functions
export const communityAuthApi = {
  // Community login
  login: async (email, password) => {
    const response = await apiCall('/api/auth/community-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token and community data
    if (response.data && response.data.token) {
      localStorage.setItem('communityToken', response.data.token);
      localStorage.setItem('communityData', JSON.stringify(response.data.user));
      console.log('✅ Community token stored:', response.data.token);
      console.log('✅ Community data stored:', response.data.user);
    } else if (response.token) {
      // Fallback for different response structure
      localStorage.setItem('communityToken', response.token);
      localStorage.setItem('communityData', JSON.stringify(response.community || response.user));
    }

    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('communityToken');
    localStorage.removeItem('communityData');
  },

  // Get community profile
  getProfile: async () => {
    return apiCall('/api/community-auth/profile');
  },

  // Update community profile
  updateProfile: async (profileData) => {
    return apiCall('/api/community-auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return apiCall('/api/community-auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiCall('/api/community-auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (resetToken, newPassword) => {
    return apiCall('/api/community-auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('communityToken');
    const communityData = localStorage.getItem('communityData');
    return !!(token && communityData);
  },

  // Get current community data
  getCurrentCommunity: () => {
    const communityData = localStorage.getItem('communityData');
    return communityData ? JSON.parse(communityData) : null;
  },
};

export default communityAuthApi;
