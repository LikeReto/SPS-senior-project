import { useState, useEffect, useRef } from "react";
import { Image } from "expo-image";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/src/Contexts/AuthContext";
import { useSocket } from "@/src/Contexts/SocketContext";
import {
  getStatusColor,
  getStatusLabel
} from "@/src/utils/USER/statusHelpers";

export default function ChatScreen() {
  const {
    id: otherUserId,
    paramConversationId,
    receiverName,
    receiverImage,
  } = useLocalSearchParams();
  const { Expo_Router, App_Language, currentUser, darkMode } = useAuth();
  const { socket, ALL_Chats, onlineUsers, sendMessageToServer } = useSocket();

  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const userStatus = onlineUsers.get(otherUserId) || "offline";


  // ------------------------------------------------
  // 1️⃣ Find conversation by checking participants
  // ------------------------------------------------
  const chat = ALL_Chats.find((c) => {
    const p = c.participants;
    return p?.includes(currentUser.$id) && p?.includes(otherUserId);
  });

  const conversationId = chat?._id || paramConversationId || null; // real Mongo ObjectId


  // fallback user info before chat exists
  const otherUser = chat?.user || {
    id: otherUserId,
    name: receiverName,
    image: receiverImage,
  };

  const imageUri =
    otherUser?.image ||
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  // ------------------------------------------------
  // 2️⃣ Sync messages with global store
  // ------------------------------------------------
  useEffect(() => {
    if (chat?.messages) setMessages(chat.messages);
  }, [ALL_Chats, chat]);

  // ------------------------------------------------
  // 3️⃣ Listen to socket events
  // ------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const incoming = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          const exists = prev.find((m) => m._id === msg._id || m.tempId === msg.tempId);
          if (exists) return prev;
          return [...prev, msg];
        });
      }
    };

    const typingEvent = ({ conversationId: cId, senderId, isTyping }) => {
      if (cId === conversationId && senderId === otherUserId) {
        setIsTyping(isTyping);
      }
    };

    const seenEvent = ({ conversationId: cId, messageId }) => {
      if (cId !== conversationId) return;

      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId || m.tempId === messageId ? { ...m, status: "seen" } : m
        )
      );
    };

    socket.on("getMessage", incoming);
    socket.on("typing", typingEvent);
    socket.on("messageSeen", seenEvent);

    return () => {
      socket.off("getMessage", incoming);
      socket.off("typing", typingEvent);
      socket.off("messageSeen", seenEvent);
    };
  }, [socket, conversationId]);

  // ------------------------------------------------
  // 4️⃣ Scroll + send seen event
  // ------------------------------------------------
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 20);

    const last = messages[messages.length - 1];

    if (!last) return;

    if (last.senderId !== currentUser.$id && last.status !== "seen") {
      socket?.emit("messageSeen", {
        conversationId,
        messageId: last._id || last.tempId,
        userId: currentUser.$id,
      });
    }
  }, [messages]);

  // ------------------------------------------------
  // 5️⃣ Send message
  // ------------------------------------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const tempId = `temp-${Date.now()}`;

    const optimistic = {
      tempId,
      conversationId,        // may be null → backend will create new one
      senderId: currentUser.$id,
      receiverId: otherUserId,
      text: input.trim(),
      time: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    socket.emit("typing", {
      conversationId,
      senderId: currentUser.$id,
      isTyping: false,
    });

    try {
      await sendMessageToServer(optimistic);
    } catch (err) {
      console.log("ERROR SENDING:", err);
    }
  };

  // ------------------------------------------------
  // 6️⃣ Typing indicator
  // ------------------------------------------------
  const handleInputChange = (text) => {
    setInput(text);

    socket.emit("typing", {
      conversationId,
      senderId: currentUser.$id,
      isTyping: text.trim().length > 0,
    });
  };


  // ---------------------------------------------------
  // GROUPING RULE:
  // Show date header when:
  // - first message OR different date from previous
  //
  // Show time under message ALWAYS (Instagram style)
  // ---------------------------------------------------
  // ----------------------
  // CENTERED DATE FORMAT
  // ----------------------
  function formatDateHeader(date) {
    const d = new Date(date);
    const now = new Date();

    const today = now.toDateString();
    const msgDay = d.toDateString();

    if (msgDay === today) return "Today";

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (msgDay === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: now.getFullYear() !== d.getFullYear() ? "numeric" : undefined,
    });
  }
  const ONE_HOUR = 3600; // seconds


  // ------------------------------------------------
  // UI: Render message
  // ------------------------------------------------
  const renderItem = ({ item, index }) => {
    const isMe = item.senderId === currentUser.$id;
    // Unified timestamp reader (DB or local optimistic message)
    const getMsgDate = (msg) => new Date(msg.createdAt || msg.time || msg.timestamp);

    const currDate = getMsgDate(item);
    const prev = messages[index - 1];
    const prevDate = prev ? getMsgDate(prev) : null;

    // ---- DATE HEADER ----
    const showDateHeader =
      index === 0 ||
      prevDate.toDateString() !== currDate.toDateString();

    // ---- 1 HOUR GROUPING ----
    let isGrouped = false;
    if (prev) {
      const seconds = (currDate - prevDate) / 1000;
      isGrouped = seconds < 3600 && prev.senderId === item.senderId;
    }

    const statusIcon =
      item.status === "sending" ? (
        <Ionicons name="time-outline" size={14} color="#ccc" />
      ) : item.status === "delivered" ? (
        <Ionicons name="checkmark" size={16} color="#eee" />
      ) : item.status === "seen" ? (
        <Ionicons name="checkmark-done" size={16} color="#DD7D10FF" />
      ) : null;

    return (
      <>
        {/* -------- DATE HEADER -------- */}
        {showDateHeader && (
          <View style={styles.centerHeaderWrapper}>
            <Text style={styles.centerHeaderText}>
              {formatDateHeader(currDate)}
            </Text>
          </View>
        )}

        {/* -------- MESSAGE BUBBLE -------- */}
        <View
          style={[
            styles.messageContainer,
            isMe ? styles.me(darkMode) : styles.them(darkMode),
            isGrouped ? { marginTop: 2 } : { marginTop: 10 },
          ]}
        >
          <Text
            style={{
              color: isMe
                ? "#fff"
                : darkMode === "light"
                  ? "#000"
                  : "#fff",
              fontSize: 14,
            }}
          >
            {item.text}
          </Text>

          {/* TIME + STATUS UNDER BUBBLE */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 3,
              alignSelf: isMe ? "flex-end" : "flex-start",
            }}
          >
            <Text style={{ color: "#999", fontSize: 10, marginRight: 4 }}>
              {currDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {isMe && statusIcon}
          </View>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a",
      }}
      behavior={"padding"}
    >
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: darkMode === "light" ? "#fff" : "#111" }]}>
        <TouchableOpacity onPress={() => Expo_Router.back()}>
          <Ionicons name="arrow-back" size={26} color="#10b981" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Text style={[styles.title, { color: darkMode === "light" ? "#111" : "#fff" }]}>
              {otherUser.name.length > 20
                ? otherUser.name.slice(0, 20) + "..."
                : otherUser.name
              }
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(userStatus) }
              ]}
              />
              {/* STATUS LABEL */}
              <Text style={[styles.statusText, { color: getStatusColor(userStatus) }]}>
                {getStatusLabel({
                  userOnline: userStatus !== "offline",
                  liveStatus: userStatus,
                  App_Language
                })}
              </Text>
            </View>
          </View>

          {isTyping && (
            <Text style={{ fontSize: 12, marginTop: 2, color: "#aaa" }}>Typing...</Text>
          )}
        </View>

        <View style={{ width: 26 }} />
      </View>

      {/* MESSAGES */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id || item.tempId}-${index}`}
        contentContainerStyle={{ padding: 12, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {/* INPUT */}
      <View style={[styles.inputBar, { backgroundColor: darkMode === "light" ? "#fff" : "#111" }]}>
        <TextInput
          value={input}
          onChangeText={handleInputChange}
          placeholder="Message..."
          style={styles.input(darkMode)}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 'auto',
    paddingHorizontal: 18,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
    marginVertical: 5,
  },
  me: (darkMode) => ({
    backgroundColor: darkMode === "light" ? "#3797EF" : "#3797EF",
    alignSelf: "flex-end"
  }),
  them: (darkMode) => ({
    backgroundColor: darkMode === "light" ? "#CFCFCFFF" : "#262626",
    alignSelf: "flex-start"
  }),
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  inputBar: {
    flexDirection: "row",
    padding: 10,
    position: "relative",
    width: "100%",
    borderTopWidth: 0.3,
    borderColor: "#333",
  },
  input: (darkMode) => ({
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
    backgroundColor: darkMode === "light" ? "#fff" : "#111111",
    color: darkMode === "light" ? "#000" : "#fff",
  }),
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#10b981",
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 21,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "relative",
    borderWidth: 2,
    borderColor: "#fff",
  },
  statusText: { fontSize: 12, fontWeight: "500", marginLeft: 4},

});
