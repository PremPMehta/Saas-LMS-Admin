// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://saas-lms-admin.onrender.com';

// Helper function for API calls
export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// For backward compatibility
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export default API_BASE_URL;
