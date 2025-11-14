import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function MyProfileCard({
    isDark,
    currentUser,
    currentUser_Data
}) {
    return (
        <View style={[styles.profileCard, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}>
            {currentUser_Data && currentUser_Data.image ? (
                <Image source={{ uri: currentUser_Data?.image }} style={styles.image} />
            ) : (
                <Ionicons
                    name="person-circle-outline"
                    size={100}
                    color={isDark ? "white" : "#555"}
                />
            )}

            <Text style={[styles.name, { color: isDark ? "white" : "#111" }]}>{currentUser?.name}</Text>
            <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
                {currentUser_Data?.User_Job}
            </Text>

            <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color={currentUser_Data?.User_PhoneNumber ? "#10b981" : "#555"} />
                <Text style={{ marginLeft: 6, color: isDark ? "white" : "#111" }}>
                    {currentUser?.User_PhoneNumber?.length > 0 ? currentUser?.User_PhoneNumber : "N/A"}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="school" size={20} color="#10b981" />
                <Text style={{ marginLeft: 6, color: isDark ? "white" : "#111" }}>
                    {currentUser_Data?.User_Degree || "N/A"}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    profileCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    image: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
    name: { fontSize: 16, fontWeight: "700" },
    job: { fontSize: 14, marginTop: 2 },
    infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
});

