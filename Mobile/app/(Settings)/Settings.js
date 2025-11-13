import { ScrollView } from "react-native";
import { useAuth } from "@/src/Contexts/AuthContext";
import SettingsHeader from "@/src/components/Settings/SettingsHeader";
import AccountSection from "@/src/components/Settings/sections/AccountSection";
import ContentDisplaySection from "@/src/components/Settings/sections/ContentDisplaySection";
import SupportAboutSection from "@/src/components/Settings/sections/SupportAboutSection";
import LoginSection from "@/src/components/Settings/sections/LoginSection";
import AppInfoSection from "@/src/components/Settings/sections/AppInfoSection";

export default function SettingsScreen() {
  const { Expo_Router, darkMode, App_Language } = useAuth();
  const isDark = darkMode === "dark";

  const t = App_Language?.startsWith("ar")
    ? { settings: "الإعدادات" }
    : { settings: "Settings" };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#0b0b0b" : "#fafafa",
      }}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <SettingsHeader onBack={() => Expo_Router.back()} title={t.settings} isDark={isDark} />

      <AccountSection />

      <ContentDisplaySection />

      <SupportAboutSection />

      <LoginSection />

      <AppInfoSection />
    </ScrollView>
  );
}
