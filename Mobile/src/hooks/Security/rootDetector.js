import * as Device from "expo-device";
import * as FileSystem from "expo-file-system";

export const checkRooted = async () => {
  try {
    // ❗ Skip simulator — false positives
    if (Device.isDevice === false) return false;

    // iOS jailbreak checks
    const iosPaths = [
      "/Applications/Cydia.app",
      "/Library/MobileSubstrate/MobileSubstrate.dylib",
      "/bin/bash",
      "/usr/sbin/sshd",
      "/etc/apt"
    ];

    for (const path of iosPaths) {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) return true;
    }

    // Android root checks
    const androidPaths = [
      "/system/app/Superuser.apk",
      "/system/xbin/su",
      "/system/bin/su"
    ];

    for (const path of androidPaths) {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};
