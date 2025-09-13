import axios from 'axios';

const API_URL = 'https://notessummarizer-production.up.railway.app';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token Management
const TokenService = {
  getToken() {
    return localStorage.getItem('token');
  },

  saveToken(token) {
    localStorage.setItem('token', token);
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  // Attach token to request headers
  attachTokenToRequest(config) {
    const token = this.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }
};

// Interceptor to add token to requests
api.interceptors.request.use(
  (config) => TokenService.attachTokenToRequest(config),
  (error) => Promise.reject(error)
);

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await api.post('/login', userData);
    
    // Save token upon successful login
    if (response.data.token) {
      TokenService.saveToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// Signup User
export const signupUser = async (userData) => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Signup failed');
  }
};

// Logout User
export const logoutUser = () => {
  TokenService.removeToken();
};

// Upload PDF
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await api.post('/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('PDF upload failed');
  }
};

// Summarize Text
export const summarizeText = async (text) => {
  try {
    const response = await api.post('/summarize', { text });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Summarization failed');
  }
};

// Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user-profile');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch user profile');
  }
};

export default api;


