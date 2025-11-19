import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import SectionTitle from "../SectionTitle";
import { SettingsCard } from "../SettingsCard";
import DarkModeModal from "@/src/components/Settings/modals/DarkModeModal";
import LanguageModal from "@/src/components/Settings/modals/LanguageModal";

export default function ContentDisplaySection({ isLoggedIn }) {
    const { darkMode, toggleDarkMode, changeLanguage, App_Language } = useAuth();

    const [DarkMode_ModalVisible, setDarkMode_ModalVisible] = useState(false);
    const [language_ModalVisible, setLanguage_ModalVisible] = useState(false);


    const t = App_Language?.startsWith("ar")
        ? {
            title: "المحتوى والعرض",
            notifications: "الإشعارات",
            activity: "مركز النشاط",
            ads: "الإعلانات",
            language: "اللغة",
            darkMode: "الوضع الداكن",
        }
        : {
            title: "Content & Display",
            notifications: "Notifications",
            activity: "Activity Center",
            ads: "Ads",
            language: "Language",
            darkMode: "Dark Mode",
        };

    return (
        <>
            <SectionTitle title={t.title} isDark={darkMode === "light" ? false : true} />

            {/* Notifications */}
            <SettingsCard
                label={t.notifications}
                icon={<Ionicons name="notifications-outline" size={22} color="#10b981" />}
                isDark={darkMode === "light" ? false : true}
            />

            {/* Activity Center */}
            <SettingsCard
                label={t.activity}
                icon={<MaterialCommunityIcons name="chart-bar" size={22} color="#10b981" />}
                isDark={darkMode === "light" ? false : true}
                disabled={isLoggedIn ? false : true}
            />

            {/* Ads */}
            <SettingsCard
                label={t.ads}
                icon={<Feather name="monitor" size={22} color="#10b981" />}
                isDark={darkMode === "light" ? false : true}
            />

            {/* Language */}
            <TouchableOpacity onPress={() => setLanguage_ModalVisible(true)}>
                <SettingsCard
                    label={t.language}
                    icon={<Ionicons name="language-outline" size={22} color="#10b981" />}
                    isDark={darkMode === "light" ? false : true}
                />
            </TouchableOpacity>

            {/* Dark Mode */}
            <TouchableOpacity onPress={() => setDarkMode_ModalVisible(true)}>
                <SettingsCard
                    label={t.darkMode}
                    icon={<Ionicons name="moon-outline" size={22} color="#10b981" />}
                    isDark={darkMode === "light" ? false : true}
                />
            </TouchableOpacity>

            {/* Dark Mode Modal */}
            <DarkModeModal
                visible={DarkMode_ModalVisible}
                onClose={() => setDarkMode_ModalVisible(false)}
                App_Language={App_Language}
                isDark={darkMode === "light" ? false : true}
                toggleDarkMode={toggleDarkMode}
            />

            {/* Language Modal */}
            <LanguageModal
                visible={language_ModalVisible}
                onClose={() => setLanguage_ModalVisible(false)}
                isDark={darkMode === "light" ? false : true}
                changeLanguage={changeLanguage}
                App_Language={App_Language}
            />

        </>
    );
}
