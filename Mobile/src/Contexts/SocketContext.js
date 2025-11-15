// src/Contexts/SocketContext.js
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "./AuthContext";

const SOCKET_URL = process.env.EXPO_PUBLIC_APP_API;
const SocketContext = createContext({});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser, User_Status } = useAuth();
  const socketRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState(new Map()); // userId -> status
  const [dmChats, setDmChats] = useState([]); // { chatId, messages: [], type, senderName, senderImage, lastMessage }

  // --- Initialize Socket ---
  useEffect(() => {
    if (!currentUser?.$id) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ [Socket.io] Connected:", socket.id);

      // Register user
      socket.emit("addUser", {
        User_$ID: currentUser.$id,
        User_Status: User_Status || "online",
        socket_Id: socket.id,
      });
    });

    // --- Incoming message ---
    socket.on("getMessage", (msg) => {
      setDmChats(prev => {
        const chatIndex = prev.findIndex(c => c.chatId === msg.chatId);

        if (chatIndex !== -1) {
          // ✅ Conversation exists: append message
          const updated = [...prev];
          updated[chatIndex].messages.push(msg);
          updated[chatIndex].lastMessage = msg;
          return updated;
        } else {
          // ✅ Conversation does NOT exist: create new chat
          const newChat = {
            chatId: msg.chatId,
            messages: [msg],
            type: "primary", // or determine dynamically if needed
            senderName: msg.senderName || "Unknown",
            senderImage: msg.senderImage || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            lastMessage: msg,
          };
          return [newChat, ...prev]; // add new chat at the top
        }
      });
    });

    // --- User online/offline/status ---
    socket.on("userOnline", ({ userId, status }) =>
      setOnlineUsers(prev => new Map(prev).set(userId, status))
    );
    socket.on("userOffline", ({ userId }) =>
      setOnlineUsers(prev => { const u = new Map(prev); u.delete(userId); return u; })
    );
    socket.on("userStatusChanged", ({ userId, status }) =>
      setOnlineUsers(prev => { const u = new Map(prev); if (u.has(userId)) u.set(userId, status); return u; })
    );

    return () => socket.disconnect();
  }, [currentUser?.$id, User_Status]);

  // --- Send message ---
  const sendMessageToServer = useCallback(async (messageData) => {
    if (!socketRef.current?.connected || !currentUser) return;
    if (!messageData.receiverId) return console.warn("⚠ receiverId is required");

    try {
      // 1️⃣ Save message in MongoDB via API
      const { data: savedMsg } = await axios.post(`${SOCKET_URL}/api/sps/sendMessage`, messageData);

      // 2️⃣ Emit to receiver & self
      socketRef.current.emit("sendMessage", savedMsg);

      // 3️⃣ Optimistic update
      setDmChats(prev => {
        const chatIndex = prev.findIndex(c => c.chatId === savedMsg.chatId);
        if (chatIndex !== -1) {
          const updated = [...prev];
          updated[chatIndex].messages.push(savedMsg);
          updated[chatIndex].lastMessage = savedMsg;
          return updated;
        } else {
          const newChat = {
            chatId: savedMsg.chatId,
            messages: [savedMsg],
            type: "primary",
            senderName: savedMsg.senderName || "You",
            senderImage: savedMsg.senderImage || currentUser.User_Profile_Picture,
            lastMessage: savedMsg,
          };
          return [newChat, ...prev];
        }
      });
    } catch (err) {
      console.error("Failed to send/save message:", err);
    }
  }, [currentUser]);

  const updateUserStatus = useCallback((status) => {
    if (socketRef.current?.connected && currentUser?.$id) {
      socketRef.current.emit("updateStatus", { userId: currentUser.$id, status });
    }
  }, [currentUser]);

  const isUserOnline = useCallback(userId => onlineUsers.has(userId), [onlineUsers]);
  const getUserStatus = useCallback(userId => onlineUsers.get(userId) || "offline", [onlineUsers]);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      onlineUsers,
      dmChats,
      setDmChats,
      sendMessageToServer,
      updateUserStatus,
      isUserOnline,
      getUserStatus,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
