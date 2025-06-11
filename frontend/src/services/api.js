import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.218.234:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }
    
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;
        await AsyncStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        throw error;
      }
    }
    throw error;
  }
);

export const auth = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/jwt/create', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/users/', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response;
      }
      throw error;
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  },
};

export const platforms = {
  getAll: async () => {
    const response = await api.get('/platforms/');
    return response.data;
  },
  getUserPlatforms: async () => {
    const response = await api.get('/user-platforms/');
    return response.data;
  },
  updateUserPlatform: async (id, data) => {
    const response = await api.patch(`/user-platforms/${id}/`, data);
    return response.data;
  },
};

export const watchlist = {
  getAll: async () => {
    const response = await api.get('/watchlist/');
    return response.data;
  },
  addItem: async (data) => {
    const response = await api.post('/watchlist/add_item/', data);
    return response.data;
  },
  removeItem: async (id) => {
    const response = await api.delete(`/watchlist/${id}/`);
    return response.data;
  },
};

export default api; 