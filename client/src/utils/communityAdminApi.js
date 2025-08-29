import { API_BASE_URL } from '../config/api';

// API utility for community admin operations
const communityAdminApi = {
  // Get all admins for a community
  getCommunityAdmins: async (communityId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community-admins/community/${communityId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch community admins');
      }

      return data;
    } catch (error) {
      console.error('❌ Error fetching community admins:', error);
      throw error;
    }
  },

  // Get single admin by ID
  getCommunityAdmin: async (adminId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community-admins/${adminId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch community admin');
      }

      return data;
    } catch (error) {
      console.error('❌ Error fetching community admin:', error);
      throw error;
    }
  },

  // Create new admin
  createCommunityAdmin: async (adminData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create community admin');
      }

      return data;
    } catch (error) {
      console.error('❌ Error creating community admin:', error);
      throw error;
    }
  },

  // Update admin
  updateCommunityAdmin: async (adminId, adminData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community-admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update community admin');
      }

      return data;
    } catch (error) {
      console.error('❌ Error updating community admin:', error);
      throw error;
    }
  },

  // Delete admin
  deleteCommunityAdmin: async (adminId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community-admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete community admin');
      }

      return data;
    } catch (error) {
      console.error('❌ Error deleting community admin:', error);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (loginData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community-admins/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Error in admin login:', error);
      throw error;
    }
  },
};

export default communityAdminApi;
