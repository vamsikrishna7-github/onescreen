import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await auth.login(email, password);
      await AsyncStorage.setItem('access_token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await auth.register(userData);
      return true;
    } catch (error) {
      if (error.data) {
        console.error('Registration error:', error.data);
        throw error;
      }
      console.error('Registration error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
  };
}; 