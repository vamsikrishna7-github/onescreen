import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#007AFF',
    secondary: '#5856D6',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#EEEEEE',
    error: '#FF3B30',
    success: '#34C759',
    card: '#FFFFFF',
    switchTrack: { false: '#767577', true: '#81b0ff' },
    switchThumb: { false: '#f4f3f4', true: '#007AFF' },
  },
  dark: {
    name: 'dark',
    background: '#1A1A1A',
    surface: '#2C2C2C',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    card: '#2C2C2C',
    switchTrack: { false: '#767577', true: '#0A84FF' },
    switchThumb: { false: '#f4f3f4', true: '#0A84FF' },
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    setTheme(isDarkMode ? themes.dark : themes.light);
  }, [isDarkMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 