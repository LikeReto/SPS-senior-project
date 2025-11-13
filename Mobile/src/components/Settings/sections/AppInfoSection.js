import { View, Text } from "react-native";
import Constants from "expo-constants";

export default function AppInfoSection() {
  const currentYear = new Date().getFullYear();

  // Use the new recommended API
  const appVersion =
    Constants.expoConfig?.version || Constants.manifest2?.version || "1.0.0";

  return (
    <View style={{ alignItems: "center", marginTop: 50, marginBottom: 20 }}>
      <Text style={{ color: "#10b981", fontWeight: "700" }}>
        SPS © {currentYear} (v{appVersion})
      </Text>
    </View>
  );
}
