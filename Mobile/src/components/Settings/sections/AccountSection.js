import React from "react";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import SectionTitle from "../SectionTitle";
import { SettingsCard } from "../SettingsCard";

export default function AccountSection() {
  const { darkMode, App_Language } = useAuth();

  const t = App_Language?.startsWith("ar")
    ? {
        title: "الحساب",
        account: "الحساب",
        privacy: "الخصوصية",
        security: "الأمان والأذونات",
        shareProfile: "مشاركة الملف الشخصي",
      }
    : {
        title: "Account",
        account: "Account",
        privacy: "Privacy",
        security: "Security & Permissions",
        shareProfile: "Share Profile",
      };

  return (
    <>
      <SectionTitle title={t.title} isDark={darkMode === "light" ? false : true} />

      {/* Account */}
      <SettingsCard
        label={t.account}
        icon={<Ionicons name="person-outline" size={22} color="#10b981" />}
        isDark={darkMode === "light" ? false : true}
      />

      {/* Privacy */}
      <SettingsCard
        label={t.privacy}
        icon={<MaterialIcons name="lock-outline" size={22} color="#10b981" />}
        isDark={darkMode === "light" ? false : true}
      />

      {/* Security & Permissions */}
      <SettingsCard
        label={t.security}
        icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color="#10b981" />}
        isDark={darkMode === "light" ? false : true}
      />

      {/* Share Profile */}
      <SettingsCard
        label={t.shareProfile}
        icon={<Ionicons name="share-social-outline" size={22} color="#10b981" />}
        isDark={darkMode === "light" ? false : true}
      />
    </>
  );
}
