import getIpAddress from '@/src/utils/get_ip_Address';
import * as Network from "expo-network";

export const checkVPN = async () => {
    try {
        const ipAddress = await getIpAddress();
        if (!ipAddress) {
            console.error("❌ Failed to get IP address.");
            return false;
        }

        // first check if the device is on a VPN using Expo Network
        const isVpnEnabled = await Network.getNetworkStateAsync();
        if (isVpnEnabled.type === Network.NetworkStateType.VPN) {
            console.log("❌ VPN detected via Expo Network:", ipAddress);
            return true; // VPN detected
        }
        else if (isVpnEnabled.isConnected && !isVpnEnabled.isInternetReachable) {
            console.log("❌ VPN or Proxy detected via Network State:", ipAddress);
            return true; // VPN or Proxy detected
        }


        // Use multiple VPN detection APIs for cross-checking
        const vpnServices = [
            { url: `https://vpnapi.io/api/${ipAddress}?key=d1209c6a42dd4bcfa91f832c52ba4ef7`, name: 'vpnapi.io' },
            { url: `https://ipinfo.io/${ipAddress}/json?token=a49f5a73e6e571`, name: 'ipinfo.io' },
            { url: `http://ip-api.com/json/178.81.42.191`, name: 'ip-api' },
        ];

        for (let service of vpnServices) {
            const response = await fetch(service.url);
            const data = await response.json();

            if (data?.security?.vpn || (data?.org && data?.org.includes('VPN'))) {
                console.log(`❌ VPN detected via ${service.name}:`, ipAddress);
                return true; // VPN detected
            }
        }

        console.log("✅ No VPN detected:", ipAddress);
        return false; // No VPN detected
    } catch (error) {
        console.error("❌ Error checking VPN status:", error);
        return false; // Default to no VPN if error occurs
    }
};