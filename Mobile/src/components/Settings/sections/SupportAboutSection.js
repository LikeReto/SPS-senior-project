import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import SectionTitle from "../SectionTitle";
import { SettingsCard } from "../SettingsCard";

export default function SupportAboutSection() {
  const { darkMode, App_Language } = useAuth();

  const t = App_Language?.startsWith("ar")
    ? {
        title: "الدعم والمساعدة",
        reportProblem: "الإبلاغ عن مشكلة",
        support: "الدعم",
        terms: "الشروط والسياسات",
      }
    : {
        title: "Support & About",
        reportProblem: "Report a Problem",
        support: "Support",
        terms: "Terms & Policies",
      };

  return (
    <>
      <SectionTitle title={t.title} isDark={darkMode === "light" ? false : true} />

      {/* Report a Problem */}
      <SettingsCard
        label={t.reportProblem}
        icon={
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={22}
            color="#10b981"
          />
        }
        isDark={darkMode === "light" ? false : true}
      />

      {/* Support */}
      <SettingsCard
        label={t.support}
        icon={
          <Ionicons
            name="help-circle-outline"
            size={22}
            color="#10b981"
          />
        }
        isDark={darkMode === "light" ? false : true}
      />

      {/* Terms & Policies */}
      <SettingsCard
        label={t.terms}
        icon={
          <Ionicons
            name="document-text-outline"
            size={22}
            color="#10b981"
          />
        }
        isDark={darkMode === "light" ? false : true}
      />
    </>
  );
}
