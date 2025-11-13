import axios from "axios";
import { getCurrentUser } from "@/src/xAppWrite/Appwrite";
// right now it is just 192.168.1.188

// Function to update current user data
export const backendUpdateUserInfo = async (userInfo) => {
    try {


        const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/Update_Current_User_Profile`, userInfo)
        if (response.status === 200 && response.data.success === true) {
            // get the updated user from Appwrite
            const Appwrite_Update_Response = await getCurrentUser();
            return {
                success: true,
                updateUserData: response.data.updateUserData,
                Appwrite_Updated_User: Appwrite_Update_Response,
            }
        }
    }
    catch (error) {
        console.error("❌ updateUserInfo ~> Error:", error.message);
        return false;
    }
}