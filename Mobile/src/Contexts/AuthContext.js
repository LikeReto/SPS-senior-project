import { useState, createContext, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { StyleSheet } from "react-native";

import useDarkMode from "@/src/hooks/App_Stuff/useDarkMode";
import useLanguage from "@/src/hooks/App_Stuff/useLanguage";
import useLocalStorage from "@/src/hooks/App_Stuff/useLocalStorage";
import useSecurityProtection from "@/src/hooks/Security/useSecurityProtection";
import useAuthActions from "@/src/Contexts/Auth/authActions";

import {
    initializeAppSettings,
    loadLocalStorageValues,
} from "@/src/Contexts/Auth/helpers/init_App";

import { fetchWorkersData } from "@/src/Contexts/Auth/helpers/fetchWorkers";

import AuthOverlays from "@/src/Contexts/Auth/ui/AuthOverlays";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const Expo_Router = useRouter();
    const pathname = usePathname();

    const { App_Language, changeLanguage } = useLanguage();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const {
        LocalStorage_Values,
        UpdateLocalStorage,
        User_Status,
        setUser_Status
    } = useLocalStorage();
    const { SecurityIssues, isBlurred } = useSecurityProtection();

    const {
        currentUser,
        currentUser_Data,
        setCurrentUser,
        setCurrentUser_Data,
        checkUserStatus,
        refreshCurrentUserData,
        loginUser,
        logoutUser,
        registerUser,
        updateUserProfile,
        addNewProject
    } = useAuthActions({ Expo_Router, App_Language, pathname });

    const [App_Loading, setApp_Loading] = useState(true);
    const [Providers, setProviders] = useState([]);
    const [location, setLocation] = useState(null);

    // -----------------------
    // INITIALIZE APP
    // -----------------------
    useEffect(() => {
        (async () => {
            const sessionExists = await checkUserStatus();

            await loadLocalStorageValues({
                pathname,
                LocalStorage_Values,
                Expo_Router,
                currentUser,
            });


            await initializeAppSettings({
                setLocation,
                fetchWorkersData: () =>
                    fetchWorkersData(setProviders),
                setApp_Loading,
                currentUser: sessionExists,
                App_Language,
            });
        })();
    }, []);

    const contextData = {
        Expo_Router,
        pathname,
        App_Language,
        changeLanguage,
        darkMode,
        toggleDarkMode,
        location,
        SecurityIssues,

        // user status
        User_Status,
        setUser_Status,

        // providers
        Providers,
        fetchWorkersData: () => fetchWorkersData(setProviders),

        // auth
        currentUser,
        currentUser_Data,
        setCurrentUser,
        setCurrentUser_Data,
        LocalStorage_Values,
        UpdateLocalStorage,
        updateUserProfile,
        refreshCurrentUserData,
        loginUser,
        logoutUser,
        registerUser,
        addNewProject,
    };

    return (
        <AuthContext.Provider value={contextData}>
            <SafeAreaView
                style={styles.container(darkMode)}
            >
                <AuthOverlays
                    App_Loading={App_Loading}
                    isBlurred={isBlurred}
                    SecurityIssues={SecurityIssues}
                />

                {SecurityIssues.length <= 0 && children}
            </SafeAreaView>
        </AuthContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: (darkMode) => ({
        flex: 1,
        backgroundColor: darkMode === "light" ? "#FAFAFA" : "#0a0a0a",
    }),
    overlay: {
        zIndex: 999,
        position: "absolute",
        opacity: 0.7,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    blurView: {
        zIndex: 9999,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export const useAuth = () => useContext(AuthContext);
