import axios from "axios";

// right now it is just 192.168.1.188


// Function to get current user data
export const backendGetCurrentUserData = async (userInfo) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/check_Current_User_Status`, userInfo)
        if (response.status === 200 && response.data.success === true) {
            return {
                success: true,
                userData: response.data.userData,
            };
        }
    }
    catch (error) {
        console.error("❌ login ~> Error:", error.message);
        return false;
    }
};
// Function to login a new user
export const backendLoginUser = async (userInfo) => {
    try {

        const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/login_Current_User`, userInfo)
        if (response.status === 200 && response.data.success === true) {
            return {
                success: true,
                userData: response.data.userData,
            };
        }
    }
    catch (error) {
        console.error("❌ login ~> Error:", error.message);
        return false;
    }
};

// Function to register a new user
export const backendRegisterUser = async (userInfo) => {

    try {

        const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/create_New_User`, userInfo)
        if (response.status === 200 && response.data.success === true) {
            return {
                success: true,
                message: response.data.message,
            };
        }
        else  {
            return {
                success: false,
                message: response.data.message || "Registration failed",
            }
        }
    }
    catch (error) {
        console.error("❌ registerUser ~> Error:", error.message);
        return {
            success: false,
            message: error.message || "Registration failed",
        }
    }
};