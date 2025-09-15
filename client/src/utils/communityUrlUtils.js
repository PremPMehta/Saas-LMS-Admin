/**
 * Utility functions for community-specific URL generation
 */

/**
 * Convert community name to URL-friendly format
 * @param {string} communityName - The community name
 * @returns {string} URL-friendly community name
 */
export const getCommunityUrlName = (communityName) => {
  if (!communityName) return '';
  return communityName.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Generate community-specific URL
 * @param {string} communityName - The community name
 * @param {string} path - The path within the community (e.g., 'dashboard', 'courses')
 * @returns {string} Full community-specific URL
 */
export const getCommunityUrl = (communityName, path = 'dashboard') => {
  const urlName = getCommunityUrlName(communityName);
  return `/${urlName}/${path}`;
};

/**
 * Get all community-specific URLs for a given community
 * @param {string} communityName - The community name
 * @returns {object} Object containing all community URLs
 */
export const getCommunityUrls = (communityName) => {
  const urlName = getCommunityUrlName(communityName);
  return {
    dashboard: `/${urlName}/admin/dashboard`,
    courses: `/${urlName}/admin/courses`,
    createCourse: `/${urlName}/admin/create-course`,
    admins: `/${urlName}/admin/admins`,
    students: `/${urlName}/admin/students`,
    courseViewer: (courseId) => `/${urlName}/admin/course-viewer/${courseId}`,
    editCourse: (courseId) => `/${urlName}/admin/edit-course/${courseId}`
  };
};

/**
 * Extract community name from URL
 * @param {string} url - The current URL
 * @returns {string|null} Community name or null if not found
 */
export const extractCommunityFromUrl = (url) => {
  const match = url.match(/\/([^\/]+)\//);
  return match ? match[1] : null;
};

/**
 * Check if current URL is a community-specific URL
 * @param {string} url - The current URL
 * @returns {boolean} True if it's a community URL
 */
export const isCommunityUrl = (url) => {
  return url.includes('/') && !url.startsWith('/discovery') && 
         !url.startsWith('/community-login') && 
         !url.startsWith('/create-community') &&
         !url.startsWith('/community-setup');
};
