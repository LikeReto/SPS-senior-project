import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL = process.env.EXPO_PUBLIC_APP_API;
const SocketContext = createContext({});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser, User_Status, followedUsers } = useAuth();
  // followedUsers = array of userIds the current user is "subscribed" to

  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState(new Map()); // userId → status
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [dmChats, setDmChats] = useState([]);

  /** Initialize socket connection */
  useEffect(() => {
    if (!currentUser?.$id) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    // --- Connected ---
    socket.on("connect", () => {
      console.log("✅ [Socket.io] Connected:", socket.id);

      socket.emit("addUser", {
        User_$ID: currentUser.$id,
        User_Status: User_Status || "online",
      });
    });

    // --- Disconnected ---
    socket.on("disconnect", (reason) => {
      console.log("❌ [Socket.io] Disconnected:", reason);
    });

    // --- User Online ---
    socket.on("userOnline", ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const updated = new Map(prev);
        updated.set(userId, status); // ⭐ ALWAYS add ANY user
        return updated;
      });
    });

    // --- User Offline ---
    socket.on("userOffline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Map(prev);
        updated.delete(userId); // ⭐ ALWAYS remove ANY user
        return updated;
      });
    });

    // --- User Status Changed ---
    socket.on("userStatusChanged", ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const updated = new Map(prev);
        if (updated.has(userId)) {
          updated.set(userId, status);
        }
        return updated;
      });
    });

    // --- Incoming Message ---
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        type: data.type || "text",
        createdAt: Date.now(),
        ...(data.isVoiceMessage && {
          sound: data.sound,
          duration: data.duration,
        }),
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?.$id, User_Status, followedUsers]);

  // --- Send Message ---
  const sendMessageToServer = useCallback((messageData) => {
    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("sendMessage", messageData);
    }
  }, []);

  // --- Update Status ---
  const updateUserStatus = useCallback((status) => {
    const socket = socketRef.current;
    if (socket && socket.connected && currentUser?.$id) {
      socket.emit("updateStatus", { userId: currentUser.$id, status });
    }
  }, [currentUser]);

  // --- Check if user is online ---
  const isUserOnline = useCallback(
    (userId) => onlineUsers.has(userId),
    [onlineUsers]
  );

  // --- Get user status ---
  const getUserStatus = useCallback(
    (userId) => onlineUsers.get(userId) || "offline",
    [onlineUsers]
  );

  // --- Clear notifications ---
  const clearNotifications = useCallback(() => setNotifications([]), []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
        arrivalMessage,
        notifications,
        dmChats,
        sendMessageToServer,
        clearNotifications,
        isUserOnline,
        getUserStatus,
        updateUserStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
