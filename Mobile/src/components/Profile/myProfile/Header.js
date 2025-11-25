import { useAuth } from "@/src/Contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import {
    getStatusColor,
    getStatusLabel
} from "@/src/utils/USER/statusHelpers";

export default function MyProfileHeader({
    isUserLoggedIn,
    userOnline,            // ✅ boolean directly
    liveStatus,            // ✅ real-time status from socket
    isDark,
    showStatusMenu,
    statusModalVisible,
    setStatusModalVisible
}) {
    const { Expo_Router, App_Language } = useAuth();

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
                            {getStatusLabel({
                                userOnline,
                                liveStatus,
                                App_Language
                            })}
                        </Text>

                        {/* Status Dot */}
                        <Ionicons
                            name="ellipse"
                            size={10}
                            color={getStatusColor(liveStatus)}
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
