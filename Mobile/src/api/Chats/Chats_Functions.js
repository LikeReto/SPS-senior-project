import axios from "axios";

// right now it is just 192.168.1.188

// 📃 Function to get all Chats
export const backendGetChats = async (userId) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/getConversations`, {
            userId: userId
        });
        return {
            success: true,
            conversations: response.data.conversations || []
        };
    }
    catch (error) {
        console.error("❌ backendGetChats ~> Error:", error.message);
        throw error;
    }
}