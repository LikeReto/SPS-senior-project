// app/(protected)/dm/[id].js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/src/Contexts/AuthContext";
import { useSocket } from "@/src/Contexts/SocketContext";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { Expo_Router, currentUser, darkMode } = useAuth();
  const { socket, dmChats, sendMessageToServer } = useSocket();
  const isDark = darkMode === "dark";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  // Load chat messages if already in dmChats
  useEffect(() => {
    const chat = dmChats?.find(c => c.chatId === id);
    if (chat?.messages) setMessages(chat.messages);
  }, [dmChats, id]);

  // Listen to incoming messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.chatId === id) {
        setMessages(prev => [...prev, msg]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, id]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      chatId: id,
      text: input.trim(),
      senderId: currentUser._id,
      senderName: currentUser.User_Name,
      senderImage: currentUser.User_Profile_Picture,
      time: new Date().toISOString(),
    };

    // Optimistic update
    setMessages(prev => [...prev, newMsg]);
    sendMessageToServer(newMsg); // send to backend via Socket
    setInput("");

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderId === currentUser._id;
    return (
      <View style={[styles.messageContainer, isMe ? styles.me : styles.them]}>
        <Text style={{ color: isMe ? "white" : isDark ? "#fff" : "#111" }}>{item.text}</Text>
        <Text style={{ fontSize: 10, color: isMe ? "#eee" : "#666", marginTop: 2 }}>
          {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? "#111" : "#fff" }]}>
        <TouchableOpacity onPress={() => Expo_Router.back()}>
          <Ionicons name="arrow-back" size={26} color="#10b981" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? "white" : "#111" }]}>Chat #{id}</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: isDark ? "#111" : "#fff" }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Message..."
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          style={[styles.input, { color: isDark ? "white" : "#111", backgroundColor: isDark ? "#1a1a1a" : "#eee" }]}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "700" },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
    marginVertical: 6,
  },
  me: { backgroundColor: "#10b981", alignSelf: "flex-end" },
  them: { backgroundColor: "#d1f7e1", alignSelf: "flex-start" },
  inputBar: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 0.3,
    borderColor: "#444",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, fontSize: 15 },
  sendBtn: { backgroundColor: "#10b981", width: 42, height: 42, borderRadius: 21, justifyContent: "center", alignItems: "center", marginLeft: 8 },
});
