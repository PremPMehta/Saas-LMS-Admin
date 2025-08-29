import { apiUrl } from '../config/api';

// Get auth token from localStorage - try community token first, then fallback to regular token
const getAuthToken = () => {
  return localStorage.getItem('communityToken') || localStorage.getItem('token');
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('🌐 API: Making request to:', apiUrl(endpoint));
    console.log('🔑 API: Config:', config);
    
    const response = await fetch(apiUrl(endpoint), config);
    console.log('📡 API: Response status:', response.status);
    
    const data = await response.json();
    console.log('📄 API: Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

// Course API functions
export const courseApi = {
  // Create a new course
  createCourse: async (courseData) => {
    return apiCall('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

          // Get all courses
        getCourses: async (filters = {}) => {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = queryParams ? `/api/courses?${queryParams}` : '/api/courses';
            const result = await apiCall(endpoint);
            return result;
        },

  // Get a single course by ID
  getCourseById: async (courseId) => {
    console.log('🔍 API: Fetching course with ID:', courseId);
    const result = await apiCall(`/api/courses/${courseId}`);
    console.log('📊 API: Course result:', result);
    return result;
  },

  // Update a course
  updateCourse: async (courseId, updateData) => {
    return apiCall(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    return apiCall(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Publish a course
  publishCourse: async (courseId) => {
    return apiCall(`/api/courses/${courseId}/publish`, {
      method: 'PATCH',
    });
  },

  // Enroll a student in a course
  enrollStudent: async (courseId, studentId) => {
    return apiCall(`/api/courses/${courseId}/enroll/${studentId}`, {
      method: 'POST',
    });
  },

  // Rate a course
  rateCourse: async (courseId, rating, studentId) => {
    return apiCall(`/api/courses/${courseId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, studentId }),
    });
  },
};

export default courseApi;
