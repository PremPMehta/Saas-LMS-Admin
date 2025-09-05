// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://lms-community-admin-backend.onrender.com'  // Update this with your actual Render URL
    : 'http://localhost:5001');

// Helper function for API calls
export const apiUrl = (endpoint) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('🔧 apiUrl function called:', { API_BASE_URL, endpoint, fullUrl }); // Debug log
  return fullUrl;
};

// For backward compatibility
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export default API_BASE_URL;
