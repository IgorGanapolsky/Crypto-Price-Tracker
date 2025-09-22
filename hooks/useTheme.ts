// Custom hook for managing app theme (light/dark mode)

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, LIGHT_THEME, DARK_THEME } from '../utils/constants';
import { ThemeColors } from '../utils/types';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem(
        STORAGE_KEYS.THEME,
        newTheme ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme: ThemeColors = isDark ? DARK_THEME : LIGHT_THEME;

  return {
    isDark,
    theme,
    toggleTheme,
    isLoading,
  };
};