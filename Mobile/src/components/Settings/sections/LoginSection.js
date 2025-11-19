import React from "react";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import SectionTitle from "../SectionTitle";
import { SettingsCard } from "../SettingsCard";

export default function LoginSection({ isLoggedIn }) {
  const { logoutUser, App_Language, darkMode } = useAuth();

  const t = App_Language?.startsWith("ar")
    ? { title: "تسجيل الدخول", logout: "تسجيل الخروج", confirm: "هل أنت متأكد أنك تريد تسجيل الخروج؟", cancel: "إلغاء" }
    : { title: "Login", logout: "Logout", confirm: "Are you sure you want to logout?", cancel: "Cancel" };

  return (
    <>
      <SectionTitle title={t.title} isDark={darkMode === "light" ? false : true} />
      <SettingsCard
        label={t.logout}
        icon={<Ionicons name="log-out-outline" size={24} color="#ef4444" />}
        isDark={darkMode === "light" ? false : true}
        disabled={isLoggedIn ? false : true}
        onPress={() => {
          Alert.alert(
            t.logout,
            t.confirm,
            [
              { text: t.cancel, style: "cancel" },
              { text: t.logout, style: "destructive", onPress: logoutUser },
            ]
          );
        }}
      />
    </>
  );
}
