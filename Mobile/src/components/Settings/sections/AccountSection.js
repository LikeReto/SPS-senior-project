import React from "react";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import SectionTitle from "../SectionTitle";
import { SettingsCard } from "../SettingsCard";

export default function AccountSection() {
  const { darkMode, App_Language } = useAuth();
  const isDark = darkMode === "dark";

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
      <SectionTitle title={t.title} isDark={isDark} />

      {/* Account */}
      <SettingsCard
        label={t.account}
        icon={<Ionicons name="person-outline" size={22} color="#10b981" />}
        isDark={isDark}
      />

      {/* Privacy */}
      <SettingsCard
        label={t.privacy}
        icon={<MaterialIcons name="lock-outline" size={22} color="#10b981" />}
        isDark={isDark}
      />

      {/* Security & Permissions */}
      <SettingsCard
        label={t.security}
        icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color="#10b981" />}
        isDark={isDark}
      />

      {/* Share Profile */}
      <SettingsCard
        label={t.shareProfile}
        icon={<Ionicons name="share-social-outline" size={22} color="#10b981" />}
        isDark={isDark}
      />
    </>
  );
}
