import * as Network from 'expo-network';

const getIpAddress = async () => {
    let localIp = null;
    let publicIp = null;

    try {
        // Get Local IP Address (Only for LAN)
        localIp = await Network.getIpAddressAsync();
        console.log("📡 Local IP:", localIp);

        // Get Public IP Address (Real External IP)
        try {
            const response = await fetch('https://api.ipify.org/?format=json');
            if (!response.ok) {
                throw new Error('Failed to fetch public IP');
            }
            const data = await response.json();
            publicIp = data.ip;
            console.log("🌎 Public IP:", publicIp);
        } 
        catch (error) {
            console.log("❌ Error fetching public IP:", error);
            publicIp = null;
        }

        return publicIp; // Return public IP or null
    } catch (error) {
        console.log("❌ Error getting IP address:", error);
        return null;
    }
};

export default getIpAddress;
