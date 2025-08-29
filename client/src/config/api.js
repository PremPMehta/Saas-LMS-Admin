// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-render-backend-url.onrender.com'  // Will be updated after deployment
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
