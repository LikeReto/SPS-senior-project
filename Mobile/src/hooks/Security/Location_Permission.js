import * as Location from "expo-location";
import { Alert } from "react-native";

export const checkLocation = async ({ App_Language }) => {
  try {
    // Check current permission
    let { status } = await Location.getForegroundPermissionsAsync();

    // --- If already granted, get coords immediately ---
    if (status === "granted") {
      const pos = await Location.getCurrentPositionAsync({});
      return {
        granted: true,
        coords: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        },
      };
    }

    // --- If NOT granted, show alert and wait for user action ---
    const userChoice = await new Promise((resolve) => {
      Alert.alert(
        App_Language.startsWith("ar")
          ? "إذن الموقع مطلوب"
          : "Location Permission Required",

        App_Language.startsWith("ar")
          ? "يرجى السماح بالوصول إلى الموقع حتى يتمكن العمال القريبون من العثور عليك."
          : "Please allow location access so nearby workers can find you.",

        [
          {
            text: App_Language.startsWith("ar") ? "إلغاء" : "Cancel",
            style: "cancel",
            onPress: () => resolve("cancel"),
          },
          {
            text: App_Language.startsWith("ar") ? "سماح" : "Allow",
            style: "default",
            onPress: () => resolve("allow"),
          },
        ],
        { cancelable: false }
      );
    });

    // --- If user pressed Cancel ---
    if (userChoice === "cancel") {
      return { granted: false, coords: null };
    }

    // --- Request permission after pressing Allow ---
    const { status: reqStatus } = await Location.requestForegroundPermissionsAsync();

    if (reqStatus !== "granted") {
      return { granted: false, coords: null };
    }

    // --- Permission GRANTED → fetch coords ---
    const pos = await Location.getCurrentPositionAsync({});

    return {
      granted: true,
      coords: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      },
    };
  } catch (error) {
    console.log("❌ checkLocation error:", error.message);
    return { granted: false, coords: null };
  }
};
