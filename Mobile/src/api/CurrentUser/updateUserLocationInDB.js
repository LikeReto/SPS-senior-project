import axios from "axios";

export const updateUserLocationInDB = async ({ latitude, longitude, User_$ID }) => {
    try {
        await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/updateLocation_coords`, {
            latitude,
            longitude,
            User_$ID,
        });

        return true;
    }
    catch (error) {
        console.error("❌ updateUserLocationInDB error:", error);
        return false;
    }
};
