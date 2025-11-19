import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Updates from 'expo-updates';


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


// 🙍🏻‍♂️ AuthActions
const useAuthActions = ({
    Expo_Router,
    App_Language,
    pathname
}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUser_Data, setCurrentUser_Data] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await checkUserStatus();
            }
            catch (error) {
                console.error("❌ authActions ~> Error in initializeAuth:", error.message);
            }
        };

        initializeAuth();
    }, []);

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

            return false;
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in checkUserStatus:", error.message);
            return false;
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
        try {
            const logoutResponse = await logout_Current_User();
            if (logoutResponse) {
                setCurrentUser(null);
                setCurrentUser_Data(null);
                Expo_Router.back();
                // reload the app to reset states
                await Updates.reloadAsync();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in logoutUser:", error.message);
            return false;
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

    return {
        // States
        currentUser,
        currentUser_Data,
        setCurrentUser,
        setCurrentUser_Data,
        // Methods
        getUserSession,
        checkUserStatus,
        refreshCurrentUserData,
        loginUser,
        logoutUser,
        registerUser,
        updateUserProfile,
    }
};

export default useAuthActions;