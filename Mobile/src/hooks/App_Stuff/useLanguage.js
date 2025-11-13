import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Hook for Language
const useLanguage = () => {
  const [App_Language, setLanguage] = useState('en'); // default language

  // Fetch language from AsyncStorage on mount
  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('App_Language');

        if (storedLang) {
          setLanguage(storedLang);
          console.log('🌍 Language loaded:', storedLang);
        } else {
          // Default fallback if not stored
          setLanguage('en');
          await AsyncStorage.setItem('App_Language', 'en');
        }
      } catch (error) {
        console.error('❌ Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);

  // Set language
  const changeLanguage = useCallback(async (lang) => {
    try {
      if (!['en-US', 'ar-SA'].includes(lang)) {
        console.warn('⚠️ Invalid language:', lang);
        return;
      }

      const storedLang = await AsyncStorage.getItem('App_Language');
      if (storedLang === lang) {
        console.log('✅ Language already set to:', lang);
        return;
      }

      await AsyncStorage.setItem('App_Language', lang);
      setLanguage(lang);
      console.log('🌐 Language switched to:', lang);

    } catch (error) {
      console.error('❌ Error updating language:', error);
    }
  }, []);

  return { App_Language, changeLanguage };
};

export default useLanguage;
