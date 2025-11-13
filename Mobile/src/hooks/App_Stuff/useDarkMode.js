import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Hook for Dark Mode
const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState('dark'); // default to 'light'

  // Fetch the theme mode from AsyncStorage on mount
  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('darkMode');
        if (storedMode === 'dark' || storedMode === 'light') {
          setDarkMode(storedMode);
          console.log('🚀 Theme mode loaded:', storedMode);
        } 
        else {
          // Default fallback if nothing is stored yet
          setDarkMode('dark');
          await AsyncStorage.setItem('darkMode', 'dark');
        }
      } catch (error) {
        console.error('❌ Error fetching darkMode:', error);
      }
    };

    fetchDarkMode();
  }, []);

  // Toggle between 'light' and 'dark'
  const toggleDarkMode = useCallback(async (clicked_mode) => {
    try {
      if (clicked_mode !== 'light' && clicked_mode !== 'dark') {
        console.warn('⚠️ Invalid mode:', clicked_mode);
        return;
      }

      const storedMode = await AsyncStorage.getItem('darkMode');
      if (storedMode === clicked_mode) {
        console.log('✅ Theme already set to:', clicked_mode);
        return;
      }

      await AsyncStorage.setItem('darkMode', clicked_mode);
      setDarkMode(clicked_mode);
      console.log('🌗 Theme switched to:', clicked_mode);
    } catch (error) {
      console.error('❌ Error updating darkMode in useDarkMode Hook:', error);
    }
  }, []);

  return { darkMode, toggleDarkMode };
};

export default useDarkMode;
