import axios from "axios";



// Function to get workers data
export const backendGetWorkersData = async () => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_APP_API}/api/sps/get_Workers`)
        if (response.status === 200 && response.data.success === true) {
            return {
                success: true,
                workersData: response.data.workersData,
            };
        }
    }
    catch (error) {
        console.error("❌ getWorkers ~> Error:", error.message);
        return false;
    }
};