// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_BASE_URL}/SignUp`,
  LOGIN: `${API_BASE_URL}/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/forget-password`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/user/${id}`,
  
  // Spaces
  ADD_SPACE: `${API_BASE_URL}/addSpace`,
  GET_SPACES: `${API_BASE_URL}/getSpaces`,
  GET_SPACES_BY_USER: (userId) => `${API_BASE_URL}/getSpacesByUserId/${userId}`,
  SPACE_BY_URL: (publicUrl) => `${API_BASE_URL}/space/${publicUrl}`,
  UPDATE_SPACE: (publicUrl) => `${API_BASE_URL}/space/${publicUrl}/update`,
  ADD_LINK: (publicUrl) => `${API_BASE_URL}/space/${publicUrl}/addLink`,
  
  // Feedback
  SUBMIT_FEEDBACK: (publicUrl) => `${API_BASE_URL}/space/${publicUrl}/feedback`,
  FEEDBACK_DETAILS: (publicUrl) => `${API_BASE_URL}/space/${publicUrl}/feedbackDetails`,
  FEEDBACK_COUNTS: (publicUrl) => `${API_BASE_URL}/space/${publicUrl}/feedbackCounts`,
  RATING_ANALYTICS: (publicUrl) => `${API_BASE_URL}/space/${publicUrl}/analytics/ratings`,
  
  // Organization APIs
  ORG_ALL_FEEDBACKS: (userId) => `${API_BASE_URL}/api/organization/${userId}/feedbacks`,
  ORG_SPACE_FEEDBACKS: (userId, publicUrl) => `${API_BASE_URL}/api/organization/${userId}/space/${publicUrl}/feedbacks`,
  
  // File Upload
  UPLOAD_IMAGE: `${API_BASE_URL}/upload`,
  UPLOAD_VIDEO: `${API_BASE_URL}/uploadVideo`,
};

// Helper function for making API calls
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_BASE_URL;