import * as Location from "expo-location";
import { updateUserLocationInDB } from "@/src/api/CurrentUser/updateUserLocationInDB";
import { checkLocation } from "@/src/hooks/Security/Location_Permission";



export const initializeAppSettings = async ({
  setLocation,
  fetchWorkersData,
  setApp_Loading,
  currentUser,
  App_Language,
}) => {
  setApp_Loading(true);

  try {

    const hasPermission = await checkLocation({ App_Language });

    if (hasPermission && hasPermission.granted) {
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // update local state
      setLocation(loc.coords);

      // update MongoDB
      if (currentUser?.$id) {
        await updateUserLocationInDB({
          latitude,
          longitude,
          User_$ID: currentUser.$id,
        });
        console.log("✅ initializeAppSettings: User location updated in DB.");
      }
      else {
        console.warn("⚠️ initializeAppSettings: No currentUser found, cannot update location in DB.");
      }
    }

    await fetchWorkersData();
  }
  catch (error) {
    console.error("❌ initializeAppSettings error:", error.message);
  }
  finally {
    setApp_Loading(false);
  }
};

export const loadLocalStorageValues = async ({
  pathname,
  LocalStorage_Values,
  Expo_Router,
  currentUser,
}) => {
  try {
    setTimeout(() => {
      if (pathname === "/onboarding") {
        if (LocalStorage_Values?.onBoarded_finished === true) {
          Expo_Router.replace("/");
        }
      } else if (
        currentUser &&
        LocalStorage_Values &&
        LocalStorage_Values.onBoarded_finished !== true
      ) {
        Expo_Router.replace("/onboarding");
      }
    }, 1000);
  } catch (error) {
    console.error("❌ loadLocalStorageValues error:", error.message);
  }
};
