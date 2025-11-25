import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Generic Local Storage Hook (for multiple flags)
const useLocalStorage = () => {
  const [LocalStorage_Values, setLocalStorage_Values] = useState({
    onBoarded_finished: false,
  });
  const [User_Status, setUser_Status] = useState("online");


  // ✅ Load stored values once when app loads
  useEffect(() => {
    const fetchValues = async () => {
      try {
        const storedValues = await AsyncStorage.getItem('LocalStorage_Values');

        if (storedValues) {
          const parsed = JSON.parse(storedValues);
          setLocalStorage_Values(parsed);
          console.log('📂 LocalStorage values loaded:', parsed);
        }
        else {
          // ✅ Save default values if none exist
          await AsyncStorage.setItem(
            'LocalStorage_Values',
            JSON.stringify(LocalStorage_Values)
          );
        }
      } catch (error) {
        console.error('❌ Error loading LocalStorage values:', error);
      }
    };

    fetchValues();
  }, []);

  // get local User statuf from asyncstorage on app load
  const getLocalUserStatus = useCallback(async () => {
    try {
      const status = await AsyncStorage.getItem("User_Status");
      if (status) {
        setUser_Status(status);
        console.log("📂 User_Status loaded from LocalStorage:", status);
      }
    } catch (error) {
      console.error("❌ Error loading User_Status from LocalStorage:", error);
    }
  }, []);

  useEffect(() => {
    getLocalUserStatus();
  }, []);

  // ✅ Update values (merge instead of overwrite)
  const UpdateLocalStorage = useCallback(async (newValues) => {
    try {
      const updatedValues = { ...LocalStorage_Values, ...newValues };

      await AsyncStorage.setItem(
        'LocalStorage_Values',
        JSON.stringify(updatedValues)
      );

      setLocalStorage_Values(updatedValues);

      console.log('💾 LocalStorage values updated:', updatedValues);
    } catch (error) {
      console.error('❌ Error updating LocalStorage values:', error);
    }
  }, [LocalStorage_Values]);

  return { LocalStorage_Values, UpdateLocalStorage, User_Status, setUser_Status };
};

export default useLocalStorage;
