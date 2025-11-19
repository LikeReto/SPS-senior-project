import { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import { useSocket } from "@/src/Contexts/SocketContext";

import {
  getStatusColor,
  getStatusLabel
} from "@/src/utils/USER/statusHelpers";

export default function DMNotificationsScreen() {
  const { Expo_Router, App_Language, darkMode } = useAuth();
  const { ALL_Chats, onlineUsers, socket, fetchChats } = useSocket();

  const [activeFilter, setActiveFilter] = useState("Primary");
  const [refreshing, setRefreshing] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Map()); // <chatId, userName>

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchChats();
    }
    finally {
      setRefreshing(false);
    }
  }, [fetchChats]);

  const filters = useMemo(
    () => [
      { label: "Primary", value: "Primary" },
      { label: "General", value: "General" },
      { label: "Requests", value: "Requests" },
    ],
    []
  );

  const filteredChats = useMemo(() => {
    if (!ALL_Chats) return [];
    switch (activeFilter) {
      case "Primary":
        return ALL_Chats.filter((c) => c.type === "primary");
      case "General":
        return ALL_Chats.filter((c) => c.type === "general");
      case "Requests":
        return ALL_Chats.filter((c) => c.type === "requests");
      default:
        return ALL_Chats;
    }
  }, [ALL_Chats, activeFilter]);

  const handleChatPress = (chat) => {
    Expo_Router.push({
      pathname: `/DM/${chat.user.id}`,
      params: {
        paramConversationId: chat._id,
        receiverName: chat.user.name,
        receiverImage: chat.user.image,
        receiverId: chat.user.id,
      }
    });
  };

  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
  };

  // --------------------------
  // Typing indicator listener
  // --------------------------
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ chatId, senderId, isTyping }) => {
      setTypingUsers((prev) => {
        const updated = new Map(prev);
        const chat = ALL_Chats.find((c) => c._id === chatId);
        const userName = chat?.user?.name || "Someone";

        if (isTyping) updated.set(chatId, userName);
        else updated.delete(chatId);

        return updated;
      });
    };

    socket.on("typing", handleTyping);
    return () => socket.off("typing", handleTyping);
  }, [socket, ALL_Chats]);

  const renderChat = useCallback(
    ({ item }) => {
      const lastMsg = item.lastMessage || {};
      const userStatus = onlineUsers.get(item.user.id) || "offline";
      const isTyping = typingUsers.has(item.chatId);

      return (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: darkMode === "light" ? "#fff" : "#1a1a1a" }]}
          onPress={() => handleChatPress(item)}
        >
          <View>
            <Image
              source={{ uri: item.user.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp" }}
              style={styles.image}
            />
            {userStatus && <View style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(userStatus) }
            ]} />}
          </View>

          <View style={styles.chatInfo}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[styles.name, { color: darkMode === "light" ? "#111" : "#fff" }]}>
                {item.user.name}
              </Text>
              {lastMsg.time && (
                <Text style={{ fontSize: 12, color: darkMode === "light" ? "#999" : "#777" }}>
                  {new Date(lastMsg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              )}
            </View>
            <Text
              style={{ color: darkMode === "light" ? "#555" : "#aaa", marginTop: 2 }}
              numberOfLines={1}
            >
              {isTyping ? "Typing..." : lastMsg.text || "No messages yet"}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [onlineUsers, darkMode, typingUsers]
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={{ color: darkMode === "light" ? "#555" : "#aaa", textAlign: "center" }}>
        {App_Language?.startsWith("ar")
          ? "لا توجد رسائل بعد. ابدأ محادثة جديدة!"
          : "No messages yet. Start a new conversation!"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: darkMode === "light" ? "#111" : "#fff" }]}>Messages</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#10b981" />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => handleFilterPress(f.value)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === f.value ? "#10b981" : darkMode === "light" ? "#e6f9f0" : "#1f1f1f",
              },
            ]}
          >
            <Text style={{ color: activeFilter === f.value ? "#fff" : darkMode === "light" ? "#111" : "#fff" }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chats List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item._id}
        renderItem={renderChat}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  filtersContainer: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 10 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, justifyContent: "center", alignItems: "center" },
  card: { marginBottom: 12, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center" },
  image: { width: 54, height: 54, borderRadius: 27 },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    bottom: 4,
    left: 44,
  },
  chatInfo: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 },
});
