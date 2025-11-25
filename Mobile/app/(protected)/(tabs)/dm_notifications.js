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
  const [typingUsers, setTypingUsers] = useState(new Map());

  const isDark = darkMode === "dark";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await fetchChats(); }
    finally { setRefreshing(false); }
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
      case "Primary": return ALL_Chats.filter(c => c.type === "primary");
      case "General": return ALL_Chats.filter(c => c.type === "general");
      case "Requests": return ALL_Chats.filter(c => c.type === "requests");
      default: return ALL_Chats;
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

  // --- SOCKET TYPING EVENTS ---
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


  // --- CHAT CARD ---
  const renderChat = useCallback(
    ({ item }) => {
      const lastMsg = item.lastMessage || {};
      const userStatus = onlineUsers.get(item.user.id) || "offline";
      const isTyping = typingUsers.has(item.chatId);

      return (
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDark ? "#121212" : "#ffffff",
              shadowColor: isDark ? "#000" : "#0f9e76",
            },
          ]}
          onPress={() => handleChatPress(item)}
        >
          {/* AVATAR */}
          <View style={{ position: "relative" }}>
            <Image
              source={{
                uri:
                  item.user.image ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
              }}
              style={styles.image}
            />
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(userStatus) },
              ]}
            />
          </View>

          {/* TEXT */}
          <View style={styles.chatInfo}>
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.name,
                  { color: isDark ? "white" : "#111" },
                ]}
              >
                {item.user.name}
              </Text>

              {lastMsg.time && (
                <Text
                  style={[
                    styles.timeTxt,
                    { color: isDark ? "#777" : "#888" },
                  ]}
                >
                  {new Date(lastMsg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              )}
            </View>

            <Text
              numberOfLines={1}
              style={{
                color: isDark ? "#aaa" : "#555",
                marginTop: 2,
                fontSize: 13,
              }}
            >
              {isTyping ? (
                <Text style={{ color: "#10b981", fontWeight: "700" }}>
                  • Typing…
                </Text>
              ) : (
                lastMsg.text || "No messages yet"
              )}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [onlineUsers, typingUsers, darkMode]
  );


  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={{ color: isDark ? "#777" : "#888", fontSize: 14 }}>
        {App_Language.startsWith("ar")
          ? "لا توجد رسائل بعد"
          : "No messages yet"}
      </Text>
    </View>
  );


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: isDark ? "white" : "#111" },
          ]}
        >
          {App_Language.startsWith("ar") ? "الرسائل" : "Messages"}
        </Text>

        <Ionicons name="chatbubbles" size={26} color="#10b981" />
      </View>

      {/* FILTERS */}
      <View style={styles.filtersContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setActiveFilter(f.value)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === f.value
                    ? "#10b981"
                    : isDark
                    ? "#1d1d1d"
                    : "#e7f8f2",
              },
            ]}
          >
            <Text
              style={{
                color: activeFilter === f.value ? "white" : isDark ? "#eee" : "#111",
                fontWeight: "600",
              }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CHAT LIST */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item._id}
        renderItem={renderChat}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 24, fontWeight: "800" },

  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
    marginRight: 12,
  },

  // CARD
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  image: { width: 58, height: 58, borderRadius: 20 },

  statusDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    bottom: 4,
    right: -2,
  },

  chatInfo: { flex: 1, marginLeft: 12 },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontSize: 16, fontWeight: "700" },
  timeTxt: { fontSize: 12, fontWeight: "500" },

  emptyContainer: {
    paddingTop: 60,
    alignItems: "center",
  },
});
