import * as Device from "expo-device";

export const checkEmulator = async () => {
    try {
        return Device.isDevice === false;
    } catch {
        return false;
    }
};
