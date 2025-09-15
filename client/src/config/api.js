// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://saas-lms-admin-1.onrender.com'  // Your live backend URL
    : 'http://localhost:5001');

// Force production URL if we're not in development
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const FINAL_API_URL = isDevelopment ? API_BASE_URL : 'https://saas-lms-admin-1.onrender.com';

// Helper function for API calls
export const apiUrl = (endpoint) => {
  const fullUrl = `${FINAL_API_URL}${endpoint}`;
  console.log('🔧 apiUrl function called:', { 
    API_BASE_URL, 
    FINAL_API_URL, 
    isDevelopment, 
    endpoint, 
    fullUrl,
    hostname: window.location.hostname,
    nodeEnv: process.env.NODE_ENV
  }); // Debug log
  return fullUrl;
};

// For backward compatibility
export const getApiUrl = (endpoint) => `${FINAL_API_URL}${endpoint}`;

export default FINAL_API_URL;
