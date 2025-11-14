import { useAuth } from "@/src/Contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function MyProfileHeader({
    isUserLoggedIn,
    userOnline,            // ✅ boolean directly
    liveStatus,            // ✅ real-time status from socket
    isDark,
    showStatusMenu,
    setShowStatusMenu,
    statusModalVisible,
    setStatusModalVisible
}) {
    const { Expo_Router, App_Language } = useAuth();

    console.log('userOnline : ', userOnline)
    // ⭐ Translate Status
    const getStatusLabel = () => {
        if (!userOnline) return App_Language.startsWith("ar") ? "غير متصل" : "Offline";

        switch (liveStatus) {
            case "online":
                return App_Language.startsWith("ar") ? "متصل" : "Online";
            case "busy":
                return App_Language.startsWith("ar") ? "مشغول" : "Busy";
            case "away":
                return App_Language.startsWith("ar") ? "بعيد" : "Away";
            case "do not disturb":
                return App_Language.startsWith("ar") ? "عدم الإزعاج" : "Do Not Disturb";
            default:
                return App_Language.startsWith("ar") ? "غير متصل" : "Offline";
        }
    };

    // ⭐ Status color
    const getStatusColor = () => {
        if (!userOnline) return "#FF0080FFغ";

        switch (liveStatus) {
            case "online":
                return "#10b981"; // green
            case "busy":
            case "away":
                return "#FFAA00"; // yellow
            case "do not disturb":
                return "#FF0000"; // red
            default:
                return "#888";
        }
    };

    return (
        <View style={styles.header(isUserLoggedIn)}>
            {isUserLoggedIn &&
                <TouchableOpacity 
                    onPress={() => setStatusModalVisible(!statusModalVisible)}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: isDark ? "white" : "#111",
                            }}
                        >
                            {getStatusLabel()}
                        </Text>

                        {/* Status Dot */}
                        <Ionicons
                            name="ellipse"
                            size={10}
                            color={getStatusColor()}
                            style={{ marginLeft: 4 }}
                        />

                        {/* Arrow */}
                        <Ionicons
                            name={showStatusMenu ? "chevron-up" : "chevron-down"}
                            size={16}
                            color={isDark ? "white" : "#111"}
                        />
                    </View>
                </TouchableOpacity>
            }

            <View style={{ flexDirection: "row", gap: 12 }}>
                {isUserLoggedIn &&
                    <TouchableOpacity onPress={() => Expo_Router.push("/EditProfileScreen")}>
                        <Ionicons name="create-outline" size={28} color="#10b981" />
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => Expo_Router.push("/Settings")}>
                    <Ionicons name="settings-outline" size={28} color={isDark ? "white" : "#111"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: (isUserLoggedIn) => ({
        flexDirection: "row",
        justifyContent: isUserLoggedIn ? "space-between" : "flex-end",
        alignItems: "center",
        padding: 20,
    }),
});
