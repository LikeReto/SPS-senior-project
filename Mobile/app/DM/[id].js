// app/(protected)/dm/DMChatScreen.js
import { useState, useEffect, useRef, useCallback } from "react";
import { Image } from "expo-image";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/Contexts/AuthContext";

export default function ChatScreen() {
  const { Expo_Router, currentUser, darkMode } = useAuth();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // --- Fake chat info ---
  const fakeChat = {
    chatId: "fake123",
    senderId: "user2_id",
    senderName: "John Doe",
    senderImage: "https://i.pravatar.cc/150?img=5",
  };

  // --- Fake messages for demo ---
  const [messages, setMessages] = useState([
    {
      id: "m1",
      text: "Hey there!",
      senderId: fakeChat.senderId,
      receiverId: "me",
      senderName: fakeChat.senderName,
      senderImage: fakeChat.senderImage,
      type: "text",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "m2",
      text: "Hello! How are you?",
      senderId: "me",
      receiverId: fakeChat.senderId,
      senderName: currentUser.User_Name,
      senderImage: currentUser.User_Profile_Picture,
      type: "text",
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: "m3",
      text: "All good. You?",
      senderId: fakeChat.senderId,
      receiverId: "me",
      senderName: fakeChat.senderName,
      senderImage: fakeChat.senderImage,
      type: "text",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
  }, []);

  useEffect(scrollToEnd, [messages]);

  // --- Send message handler ---
  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: `m${messages.length + 1}`,
      text: input.trim(),
      senderId: "me",
      receiverId: fakeChat.senderId,
      senderName: currentUser.User_Name,
      senderImage: currentUser.User_Profile_Picture,
      type: "text",
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");
    scrollToEnd();
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderId === "me";
    return (
      <View style={[styles.messageContainer, isMe ? styles.me : styles.them]}>
        <Text style={{ color: isMe ? "#fff" : darkMode === "light" ? "#111" : "#fff" }}>{item.text}</Text>
        <Text style={{ fontSize: 10, color: isMe ? "#eee" : "#666", marginTop: 2 }}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: darkMode === "light" ? "#fff" : "#111" }]}>
        <TouchableOpacity onPress={() => Expo_Router.back()}>
          <Ionicons name="arrow-back" size={26} color="#10b981" />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Image source={{ uri: fakeChat.senderImage }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />
          <Text style={{ fontSize: 18, fontWeight: "700", color: darkMode === "light" ? "#111" : "#fff" }}>
            {fakeChat.senderName}
          </Text>
        </View>
        <View style={{ width: 26 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}
      />

      {/* Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: darkMode === "light" ? "#fff" : "#111" }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Message..."
          placeholderTextColor={darkMode === "light" ? "#666" : "#aaa"}
          style={[styles.input, { color: darkMode === "light" ? "#111" : "#fff", backgroundColor: darkMode === "light" ? "#eee" : "#1a1a1a" }]}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          {loading ? <ActivityIndicator color="white" /> : <Ionicons name="send" size={22} color="#fff" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { height: 60, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 4 },
  messageContainer: { padding: 10, borderRadius: 12, maxWidth: "75%", marginVertical: 6 },
  me: { backgroundColor: "#10b981", alignSelf: "flex-end" },
  them: { backgroundColor: "#d1f7e1", alignSelf: "flex-start" },
  inputBar: { flexDirection: "row", padding: 10, borderTopWidth: 0.3, borderColor: "#444", position: "absolute", bottom: 0, width: "100%" },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, fontSize: 15 },
  sendBtn: { backgroundColor: "#10b981", width: 42, height: 42, borderRadius: 21, justifyContent: "center", alignItems: "center", marginLeft: 8 },
});
