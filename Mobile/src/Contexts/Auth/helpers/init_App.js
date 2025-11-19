import * as Location from "expo-location";

export const requestLocationPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

export const initializeAppSettings = async ({
  checkUserStatus,
  setLocation,
  fetchWorkersData,
  setApp_Loading,
}) => {
  setApp_Loading(true);

  try {
    await checkUserStatus();

    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    }

    await fetchWorkersData();
  } catch (error) {
    console.error("❌ initializeAppSettings error:", error.message);
  } finally {
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
