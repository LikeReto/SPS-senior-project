import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import { useSocket } from "@/src/Contexts/SocketContext";

export default function DMNotificationsScreen() {
  const { Expo_Router, darkMode } = useAuth();
  const { dmChats, notifications } = useSocket();

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a", 
    }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: darkMode === "light" ? "#111111" : "white" }]}>Messages</Text>
        {notifications?.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications?.length}</Text>
          </View>
        )}
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#10b981" />
      </View>

      {/* DM list */}
      {dmChats?.map((chat) => (
        <TouchableOpacity
          key={chat.chatId}
          style={[styles.card, { backgroundColor: darkMode === "light" ? "#fff" : "#1a1a1a" }]}
          onPress={() => Expo_Router.push(`/DM/${chat.chatId}`)}
        >
          <Image source={{ uri: chat.senderImage }} style={styles.image} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.name, { color: darkMode === "light" ? "#111" : "white" }]}>{chat.senderName}</Text>
            <Text style={{ color: darkMode === "light" ? "#555" : "#aaa", marginTop: 2 }} numberOfLines={1}>
              {chat.message}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: darkMode === "light" ? "#999" : "#666", marginLeft: 6 }}>
            {chat.time}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  badge: { backgroundColor: "#10b981", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 8 },
  badgeText: { color: "#fff", fontWeight: "700" },
  card: { marginHorizontal: 16, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 10 },
  image: { width: 54, height: 54, borderRadius: 27 },
  name: { fontSize: 16, fontWeight: "600" },
});
