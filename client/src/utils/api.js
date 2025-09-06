// API Utility Functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://saas-lms-admin-1.onrender.com' 
    : 'http://localhost:5001');

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  return response.json();
};

// Specific API functions
export const api = {
  // Auth
  login: (credentials) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  changeFirstPassword: (passwordData) => apiCall('/api/auth/change-first-password', {
    method: 'POST',
    body: JSON.stringify(passwordData)
  }),

  // Users
  getUsers: () => apiCall('/api/users'),
  createUser: (userData) => apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  updateUser: (id, userData) => apiCall(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  deleteUser: (id) => apiCall(`/api/users/${id}`, {
    method: 'DELETE'
  }),

  // Academies
  getAcademies: () => apiCall('/api/academies'),
  createAcademy: (academyData) => apiCall('/api/academies', {
    method: 'POST',
    body: JSON.stringify(academyData)
  }),
  updateAcademy: (id, academyData) => apiCall(`/api/academies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(academyData)
  }),
  deleteAcademy: (id) => apiCall(`/api/academies/${id}`, {
    method: 'DELETE'
  }),

  // Plans
  getPlans: () => apiCall('/api/plans'),
  createPlan: (planData) => apiCall('/api/plans', {
    method: 'POST',
    body: JSON.stringify(planData)
  }),
  updatePlan: (id, planData) => apiCall(`/api/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(planData)
  }),
  deletePlan: (id) => apiCall(`/api/plans/${id}`, {
    method: 'DELETE'
  })
};

export default API_BASE_URL;
