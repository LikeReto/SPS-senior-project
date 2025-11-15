import { useState, createContext, useEffect, useContext } from "react";
import { StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import * as Location from "expo-location";
import * as Animatable from 'react-native-animatable'
import { BlurView } from 'expo-blur';

// Loading Indicator
import Loading from '@/src/others/Loading';

import useDarkMode from "@/src/hooks/App_Stuff/useDarkMode";
import useLanguage from "@/src/hooks/App_Stuff/useLanguage";
import useLocalStorage from "@/src/hooks/App_Stuff/useLocalStorage";

// Security hooks
import useSecurityProtection from "@/src/hooks/Security/useSecurityProtection";


import SomethingWrong from "@/SomethingWrong";

// Appwrite Auth Functions
import {
    getCurrentUser,
    Login_Current_User,
    logout_Current_User,
} from "@/src/xAppWrite/Appwrite";

import { backendUpdateUserInfo } from "@/src/api/CurrentUser/updateUserInfo";

import {
    backendGetCurrentUserData,
    backendLoginUser,
    backendRegisterUser
} from "@/src/api/CurrentUser/Get_Login_register_User";

import {
    backendGetWorkersData
} from "@/src/api/USERS/Workers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const Expo_Router = useRouter();
    const pathname = usePathname();

    const { App_Language, changeLanguage } = useLanguage();
    const { darkMode, toggleDarkMode } = useDarkMode();

    const { LocalStorage_Values, UpdateLocalStorage } = useLocalStorage();
    // current Security stuff " VPN and so on...etc "
    const { SecurityIssues, isBlurred } = useSecurityProtection();

    const [App_Loading, setApp_Loading] = useState(true);

    // fake workers data
    const [Providers, setProviders] = useState([]);


    const [location, setLocation] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);
    const [currentUser_Data, setCurrentUser_Data] = useState(null);
    const [User_Status, setUser_Status] = useState('online');
    const [followedUsers, setFollowedUsers] = useState([]); // array of userIds the current user is "subscribed" to

    // request location permission
    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Location permission is required to show nearby workers"
            );
            return false;
        }
        return true;
    };



    // Initialize App Settings
    const initializeAppSettings = async () => {
        try {
            await checkUserStatus();
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                let loc = await Location.getCurrentPositionAsync({});
                setLocation(loc.coords);
            }

            await fetchWorkersData();

        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in initializeAppSettings:", error.message);
        }
    };

    useEffect(() => {
        async function Initialize() {
            await initializeAppSettings();
        }
        Initialize();
    }, []);

    //🙍🏻‍♂️ Loads Local Storage Values
    const loadLocalStorageValues = async () => {
        try {
            setTimeout(async () => {
                // Already handled in useLocalStorage hook
                if (pathname === "/onboarding") {
                    if (LocalStorage_Values && LocalStorage_Values.onBoarded_finished === true) {
                        Expo_Router.replace("/");
                    }
                }
                // check if the onboarding is done
                else if (currentUser && LocalStorage_Values && LocalStorage_Values.onBoarded_finished !== true) {
                    Expo_Router.replace("/onboarding");
                }
            }, 1000);


        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in loadLocalStorageValues:", error.message);
        }

    }
    //🙍🏻‍♂️ get Current User Session 
    const getUserSession = async () => {
        try {
            if (!currentUser) {
                const userSession = await getCurrentUser();
                if (userSession) {
                    // get the user data from backend
                    const getData_post = {
                        User_$ID: userSession.$id,
                        email: userSession.email,
                    }
                    const userDataResponse = await backendGetCurrentUserData(getData_post);
                    if (userDataResponse && userDataResponse.success === true) {
                        setCurrentUser_Data(userDataResponse.userData);
                        setCurrentUser(userSession);
                        return true;
                    }
                    else {
                        setCurrentUser(null);
                        setCurrentUser_Data(null);
                        Alert.alert(App_Language.startsWith("ar")
                            ? "جلسة المستخدم غير صالحة. يرجى تسجيل الدخول مرة أخرى."
                            : "User session is invalid. Please log in again.");

                        return false;
                    }
                }
                else {
                    setCurrentUser(null);
                    setCurrentUser_Data(null);
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in getUserSession:", error.message);
            return false;
        }
    };

    //🙍🏻‍♂️ check user status method
    const checkUserStatus = async () => {
        try {
            await getUserSession();

            await loadLocalStorageValues();
            return false;
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in checkUserStatus:", error.message);
            return false;
        }
        finally {
            setTimeout(() => {
                setApp_Loading(false);
            }, 1500);
        }
    };

    //🙍🏻‍♂️ refresh current user data
    const refreshCurrentUserData = async () => {
        try {
            if (currentUser) {
                // get the user data from backend
                const getData_post = {
                    User_$ID: currentUser.$id,
                    email: currentUser.email,
                }
                const userDataResponse = await backendGetCurrentUserData(getData_post);
                if (userDataResponse && userDataResponse.success === true) {
                    setCurrentUser_Data(userDataResponse.userData);
                }
            }
            else {
                Alert.alert(App_Language.startsWith("ar")
                    ? "سجل دخول."
                    : "Please log in."
                );
            }
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in refreshCurrentUserData:", error.message);
        }
    };

    //🚀 login current user 
    const loginUser = async (userInfo) => {
        try {
            const post_data = {
                email: userInfo.email,
                password: userInfo.password,
                User_Language: App_Language,
            }
            // Call Appwrite login function
            const loginResponse = await Login_Current_User(post_data);
            // check response
            if (loginResponse && loginResponse.success === true) {
                setCurrentUser(loginResponse.session);
                // now get the user data from backend
                const userDataResponse = await backendLoginUser(post_data);
                if (userDataResponse && userDataResponse.success === true) {
                    setCurrentUser_Data(userDataResponse.userData);
                    Expo_Router.replace("/");
                    await checkUserStatus();
                    console.log("✅ AuthContext ~> User logged in successfully:");
                    return true;
                }

            }
            Alert.alert(App_Language.startsWith("ar")
                ? "فشل تسجيل الدخول"
                : "Login Failed");
            return false;
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in loginUser:", error.message);
            Alert.alert(App_Language.startsWith("ar")
                ? "فشل تسجيل الدخول"
                : "Login Failed");
            return false;
        }
    };

    //🚀 logout current user
    const logoutUser = async () => {
        setApp_Loading(true);
        try {
            const logoutResponse = await logout_Current_User();
            if (logoutResponse) {
                setCurrentUser(null);
                setCurrentUser_Data(null);
                Expo_Router.back();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in logoutUser:", error.message);
            return false;
        }
        finally {
            setApp_Loading(false);
        }
    };

    //🚀 register current user 
    const registerUser = async (userInfo) => {
        try {
            const post_data = {
                name: userInfo.name,
                username: userInfo.username?.toLowerCase()?.replace(/\s/g, ''),
                email: userInfo.email?.toLowerCase()?.replace(/\s/g, ''),
                password: userInfo.password,
                User_Language: App_Language,
            };
            // Call backend register function
            const registerResponse = await backendRegisterUser(post_data);
            // check response
            if (registerResponse && registerResponse.success === true) {
                console.log("✅ AuthContext ~> User registered successfully:", registerResponse);
                // login the user after successful registration
                await loginUser(userInfo);
                return true;
            }
            Alert.alert(
                // show message from backend if exists
                App_Language.startsWith("ar") ? "فشل إنشاء الحساب" : "Signup Failed",
                registerResponse.message?.length > 0
                    ? `${registerResponse.message}`
                    : App_Language.startsWith("ar")
                        ? "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى."
                        : "An error occurred while creating the account. Please try again."
            );
            return false;
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in registerUser:", error.message);
            Alert.alert(App_Language.startsWith("ar")
                ? "فشل إنشاء الحساب"
                : "Signup Failed");
            return false;
        }
    };

    //🚀 Update user profile
    const updateUserProfile = async (userInfo) => {
        try {
            const post_data = {
                ...userInfo,
                User_$ID: currentUser.$id,
                User_PhoneUpdate: userInfo.User_PhoneNumber !== currentUser_Data.User_PhoneNumber,
                User_EmailUpdate: userInfo.User_Email !== currentUser.email,
            }
            // Call backend update function
            const updateResponse = await backendUpdateUserInfo(post_data);
            // check response
            if (updateResponse && updateResponse.success === true) {
                setCurrentUser(updateResponse.Appwrite_Updated_User);
                setCurrentUser_Data(updateResponse.updateUserData);
                Alert.alert(App_Language.startsWith("ar")
                    ? "تم تحديث الملف الشخصي بنجاح"
                    : "Profile Updated Successfully");
                return true;
            }

        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in updateUserProfile:", error.message);
            Alert.alert(App_Language.startsWith("ar")
                ? "فشل تحديث الملف الشخصي"
                : "Profile Update Failed");
            return false;
        }
    };


    // USERS functions can be added here
    const fetchWorkersData = async () => {
        try {
            const workersResponse = await backendGetWorkersData();
            if (workersResponse && workersResponse.success === true) {
                setProviders(workersResponse.workersData);
                return true;
            }
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in fetchWorkersData:", error.message);
            return false;
        }
    }



    const contextData = {
        Expo_Router,
        pathname,
        App_Language,
        changeLanguage,
        darkMode,
        toggleDarkMode,
        location,

        // Security Array 
        SecurityIssues,

        //Current User
        currentUser,
        currentUser_Data,
        User_Status,
        followedUsers,
        setUser_Status,
        setCurrentUser,
        setCurrentUser_Data,
        LocalStorage_Values,
        UpdateLocalStorage,
        updateUserProfile,
        refreshCurrentUserData,

        // Workers Data
        Providers,
        fetchWorkersData,

        // Authentication
        loginUser,
        logoutUser,
        registerUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            <SafeAreaView
                style={styles.container(darkMode)}
            >
                {/* 🟢 Show Loading Overlay on top of current page */}
                {App_Loading && (
                    <Animatable.View
                        animation="fadeIn"
                        duration={500}
                        useNativeDriver={true}
                        easing="ease-in-out"
                        key="loadingOverlay"
                        style={styles.overlay}
                    >
                        <Loading />
                    </Animatable.View>
                )}

                {/* Blur effect if needed */}
                {isBlurred && <BlurView style={styles.blurView} intensity={60} tint="dark" />}

                {/* 🔹 Page content renders beneath the loading screen */}
                {SecurityIssues.length > 0 && (
                    <Animatable.View
                        animation="fadeIn"
                        duration={500}
                        useNativeDriver={true}
                        easing="ease-in-out"
                        key="securityIssuesOverlay"

                        style={{
                            zIndex: 999,
                            position: 'absolute',
                            opacity: 1,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    >
                        <SomethingWrong />
                    </Animatable.View>
                )}
                {SecurityIssues.length <= 0 && children}
            </SafeAreaView>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

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
