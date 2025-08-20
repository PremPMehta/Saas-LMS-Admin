// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://saas-lms-admin.onrender.com' 
    : 'http://localhost:5001');

// Helper function for API calls
export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export default API_BASE_URL;
