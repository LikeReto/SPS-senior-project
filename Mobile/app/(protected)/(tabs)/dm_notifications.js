// app/(protected)/dm/DMNotificationsScreen.js
import React, { useState, useMemo, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";
import { useSocket } from "@/src/Contexts/SocketContext";

export default function DMNotificationsScreen() {
  const { Expo_Router, darkMode } = useAuth();
  const { dmChats: socketChats, onlineUsers } = useSocket();

  // Filters
  const [activeFilter, setActiveFilter] = useState("Primary");
  const filters = [
    { label: "Primary", value: "Primary" },
    { label: "General", value: "General" },
    { label: "Requests", value: "Requests" },
  ];

  // ⭐ Fake chats for demo
  const [dmChats, setDmChats] = useState([]);
  useEffect(() => {
    const fakeChats = [
      {
        chatId: "chat1",
        type: "primary",
        senderName: "Alice",
        senderId: "alice123",
        senderImage: "https://i.pravatar.cc/150?img=1",
        lastMessage: { text: "See you tomorrow!", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        messages: [],
      },
      {
        chatId: "chat2",
        type: "primary",
        senderName: "Bob",
        senderId: "bob456",
        senderImage: "https://i.pravatar.cc/150?img=2",
        lastMessage: { text: "Got it, thanks!", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
        messages: [],
      },
      {
        chatId: "chat3",
        type: "general",
        senderName: "Charlie",
        senderId: "charlie789",
        senderImage: "https://i.pravatar.cc/150?img=3",
        lastMessage: { text: "Can we meet later?", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        messages: [],
      },
      {
        chatId: "chat4",
        type: "primary",
        senderName: "Diana",
        senderId: "diana321",
        senderImage: "https://i.pravatar.cc/150?img=4",
        lastMessage: { text: "Thank you!", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
        messages: [],
      },
      {
        chatId: "chat5",
        type: "general",
        senderName: "Ethan",
        senderId: "ethan654",
        senderImage: "https://i.pravatar.cc/150?img=5",
        lastMessage: { text: "Let's catch up soon.", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
        messages: [],
      },
    ];
    setDmChats(fakeChats);
  }, []);

  // Filtered chats based on active filter
  const filteredChats = useMemo(() => {
    if (!dmChats) return [];
    if (activeFilter === "Requests") return []; // Push Requests screen later
    if (activeFilter === "General") return dmChats.filter(c => c.type === "general");
    return dmChats.filter(c => c.type === "primary");
  }, [dmChats, activeFilter]);

  const handleChatPress = (chat) => {
    Expo_Router.push(`/DM/${chat.chatId}`);
  };

  const handleFilterPress = (filter) => {
    if (filter === "Requests") {
      Expo_Router.push("/DMRequests");
    } else {
      setActiveFilter(filter);
    }
  };

  const renderChat = ({ item }) => {
    const lastMsg = item.lastMessage || {};
    const isOnline = onlineUsers?.has?.(item.senderId) || Math.random() > 0.5; // Random online status for demo

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: darkMode === "light" ? "#fff" : "#1a1a1a" }]}
        onPress={() => handleChatPress(item)}
      >
        <Image source={{ uri: item.senderImage }} style={styles.image} />
        {isOnline && <View style={styles.onlineDot} />}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.name, { color: darkMode === "light" ? "#111" : "#fff" }]}>{item.senderName}</Text>
          <Text style={{ color: darkMode === "light" ? "#555" : "#aaa", marginTop: 2 }} numberOfLines={1}>
            {lastMsg.text || "No messages yet"}
          </Text>
        </View>

        <Text style={{ fontSize: 12, color: darkMode === "light" ? "#999" : "#666", marginLeft: 6 }}>
          {lastMsg.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: darkMode === "light" ? "#111111" : "#fff" }]}>Messages</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#10b981" />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.value}
            onPress={() => handleFilterPress(f.value)}
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === f.value ? "#10b981" : darkMode === "light" ? "#e6f9f0" : "#1f1f1f",
              },
            ]}
          >
            <Text style={{ color: activeFilter === f.value ? "#fff" : darkMode === "light" ? "#111" : "#fff" }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DM Chats List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.chatId}
        renderItem={renderChat}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700" },

  filtersContainer: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 10 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, alignItems: "center", justifyContent: "center" },

  card: { marginBottom: 10, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center" },
  image: { width: 54, height: 54, borderRadius: 27 },
  onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#10b981", position: "absolute", top: 6, left: 44, borderWidth: 2, borderColor: "#fff" },
  name: { fontSize: 16, fontWeight: "600" },
});
