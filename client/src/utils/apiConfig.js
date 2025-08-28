// Global API Configuration - Updated for CORS fix
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Replace all localhost URLs with production URL
window.API_BASE_URL = API_BASE_URL;

// Override fetch to automatically replace localhost URLs (only in production)
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (process.env.NODE_ENV === 'production' && typeof url === 'string' && url.includes('http://localhost:5001')) {
    url = url.replace('http://localhost:5001', API_BASE_URL);
  }
  return originalFetch(url, options);
};

export default API_BASE_URL;
