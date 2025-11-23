// src/components/Profile/WorkerProfileCard.js
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function WorkerProfileCard({
    isDark,
    worker,
    imageUri,
    onChatPress,
    App_Language
}) {
    return (
        <View
            style={[
                styles.profileCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#fff" },
            ]}
        >
            {imageUri.length > 0 ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
                <Ionicons
                    name="person-circle-outline"
                    size={100}
                    color={isDark ? "white" : "#555555"}
                />
            )}

            <Text
                style={[
                    styles.name,
                    { color: isDark ? "white" : "#111" }
                ]}
            >
                {worker.User_Name.length > 15
                    ? worker.User_Name.slice(0, 15) + "..."
                    : worker.User_Name
                }
            </Text>
            {/* FREELANCER BADGE */}
            {worker?.User_Freelancer && (
                <Text style={styles.freelancerBadge}>
                    {App_Language.startsWith("ar")
                        ? "عمل حر ⭐"
                        : "⭐ Freelancer"
                    }
                </Text>
            )}

            <Text style={[styles.job, { color: isDark ? "#10b981" : "#00a36c" }]}>
                {worker.User_Job || ""}
            </Text>

            <View style={styles.infoRow}>
                <Ionicons
                    name="call"
                    size={20}
                    color={worker.User_PhoneNumber ? "#10b981" : "#555"}
                />
                <Text style={{ marginLeft: 6, color: isDark ? "white" : "#111" }}>
                    {worker.User_PhoneNumber?.length > 0 && worker?.User_PhoneNumber_Hidden !== true
                        ? `+${worker?.User_CallingCode + worker?.User_PhoneNumber}`
                        : "N/A"
                    }
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="school" size={20} color="#10b981" />
                <Text style={{ marginLeft: 6, color: isDark ? "white" : "#111" }}>
                    {worker.User_Degree || "N/A"}
                </Text>
            </View>

            {/* CHAT BUTTON */}
            <TouchableOpacity style={styles.chatBtn} onPress={onChatPress}>
                <Text style={styles.chatBtnText}>Chat</Text>
            </TouchableOpacity>
        </View>
    );
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

    chatBtn: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: "#10b981",
    },
    chatBtnText: {
        color: "white",
        fontWeight: "700"
    },
    freelancerBadge: {
        fontSize: 12,
        color: "#10b981",
        marginVertical: 6,
        fontWeight: "bold",
    },
});
