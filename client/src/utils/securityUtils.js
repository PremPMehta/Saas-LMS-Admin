/**
 * Security utility functions for community name validation
 */

/**
 * Validates if a community name is in a valid format
 * @param {string} communityName - The community name to validate
 * @returns {boolean} - True if valid, false if invalid
 */
export const isValidCommunityName = (communityName) => {
  if (!communityName || 
      communityName.includes('[') || 
      communityName.includes(']') || 
      communityName.includes('community-name') ||
      communityName.length < 2 ||
      !/^[a-zA-Z0-9-]+$/.test(communityName)) {
    return false;
  }
  return true;
};

/**
 * Security check for API calls - blocks invalid community names
 * @param {string} communityName - The community name to validate
 * @param {string} apiType - Type of API call for logging (e.g., 'courses', 'users', 'about-us')
 * @returns {boolean} - True if valid (proceed), false if invalid (blocked)
 */
export const validateCommunityNameForAPI = (communityName, apiType = 'API') => {
  if (!isValidCommunityName(communityName)) {
    console.log(`🚫 SECURITY: Invalid community name format, blocking ${apiType} API call:`, communityName);
    return false;
  }
  return true;
};

/**
 * Security check with callback for API calls
 * @param {string} communityName - The community name to validate
 * @param {string} apiType - Type of API call for logging
 * @param {function} onInvalid - Callback function to call if invalid
 * @returns {boolean} - True if valid (proceed), false if invalid (blocked)
 */
export const validateCommunityNameWithCallback = (communityName, apiType, onInvalid) => {
  if (!isValidCommunityName(communityName)) {
    console.log(`🚫 SECURITY: Invalid community name format, blocking ${apiType} API call:`, communityName);
    if (onInvalid && typeof onInvalid === 'function') {
      onInvalid();
    }
    return false;
  }
  return true;
};
