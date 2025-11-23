import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Updates from 'expo-updates';


// Appwrite Auth Functions
import {
    getCurrentUser,
    Login_Current_User,
    logout_Current_User,
    upload_File_To_Storage,
    delete_File_From_Storage
} from "@/src/xAppWrite/Appwrite";

import { backendUpdateUserInfo } from "@/src/api/CurrentUser/updateUserInfo";

import {
    backendGetCurrentUserData,
    backendLoginUser,
    backendRegisterUser
} from "@/src/api/CurrentUser/Get_Login_register_User";
import axios from "axios";


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

    //🚀 Add new project to current user 
    const addNewProject = async (newProject) => {
        let uploaded_Project_Image_FIle = null;
        try {
            if (currentUser_Data) {
                // the user's current projects is array of objects
                // { title, price, image, description }
                // node js will handle the addition using addToSet to avoid duplicates

                // first upload the image to Appwrite storage if exists
                if (newProject.Project_Image && newProject.Project_Image?.uri && newProject.Project_Image?.size > 0) {
                    console.log("✅ AuthContext ~> Uploading new project image to storage...");
                    // upload to Appwrite storage
                    const upload_Project_Image_Response = await upload_File_To_Storage(newProject.Project_Image);
                    if (upload_Project_Image_Response && upload_Project_Image_Response.success === true
                        && upload_Project_Image_Response.projectFileURL) {
                        uploaded_Project_Image_FIle = upload_Project_Image_Response.projectFileURL;
                        console.log("✅ AuthContext ~> Project image uploaded successfully");
                    }
                }

                const post_data = {
                    User_$ID: currentUser.$id,
                    newProject: {
                        Project_Title: newProject.Project_Title,
                        Project_Type: newProject.Project_Type,
                        Project_Description: newProject.Project_Description,
                        Project_Price: newProject.Project_Price,
                        Project_Image: uploaded_Project_Image_FIle || null,
                        Project_Status: newProject.Project_Status || "active",
                    },
                }
                const updateResponse = await axios.post(
                    `${process.env.EXPO_PUBLIC_APP_API}/api/sps/addNewProject`,
                    post_data
                );

                if (updateResponse.status === 200 && updateResponse.data.success === true) {
                    // refresh user data
                    // only update the projects array locally to avoid extra call
                    // the backend already sent updatedUser 
                    setCurrentUser_Data(updateResponse.data.updatedUser);
                    Alert.alert(App_Language.startsWith("ar")
                        ? "تمت إضافة المشروع بنجاح"
                        : "Project Added Successfully");
                    return true;
                }
            }
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in addNewProject:", error.message);

        }
    };
    //🚀 Remove specific project from current user 
    const removeProject = async (projectTitle) => {
        try {
            if (currentUser_Data) {
                const post_data = {
                }
            }
        }
        catch (error) {
            console.error("❌ AuthContext ~> Error in removeProject:", error.message);
        }
    };

    return {
        // States
        currentUser,
        currentUser_Data,
        setCurrentUser,
        setCurrentUser_Data,

        // Functions to manage current user
        getUserSession,
        checkUserStatus,
        refreshCurrentUserData,
        loginUser,
        logoutUser,
        registerUser,
        updateUserProfile,
        addNewProject
    }
};

export default useAuthActions;