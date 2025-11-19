import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

import {
  backendGetChats
} from "@/src/api/Chats/Chats_Functions";

const SOCKET_URL = process.env.EXPO_PUBLIC_APP_API;
const SocketContext = createContext({});
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser, User_Status } = useAuth();
  const socketRef = useRef(null);

  const [ALL_Chats, setALL_Chats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [typingUsers, setTypingUsers] = useState(new Map());


  // Function to fetch chats from backend and set to ALL_Chats
  const fetchChats = useCallback(async () => {
    if (!currentUser?.$id) return;
    try {
      const res = await backendGetChats(currentUser.$id);
      setALL_Chats(res.conversations || []);
      console.log("✅ Fetched conversations:", res.conversations.length);
    }
    catch (error) {
      console.error("❌ Error fetching chats:", error.message);
    }
  }, [currentUser?.$id]);
  // --------------------------
  // Initialize Socket.IO
  // --------------------------
  useEffect(() => {
    if (!currentUser?.$id) return;


    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
    socketRef.current = socket;

    socket.on("connect", async () => {
      console.log("🟢 Socket Connected:", socket.id);
      socket.emit("addUser", {
        User_$ID: currentUser.$id,
        User_Status: User_Status || "online",
        socket_Id: socket.id,
      });

      // 1️⃣ FETCH CONVERSATIONS FROM DATABASE
      try {
        await fetchChats();
      }
      catch (error) {
        console.error("❌ Error fetching chats on connect:", error.message);
      }
    });
    // ---------------------------------------------------
    //  RECEIVE MESSAGE
    //  msg = {
    //    _id, tempId?, conversationId, senderId, receiverId,
    //    text, type, time, status,
    //    senderName?, senderImage?, receiverName?, receiverImage?
    //  }
    // ---------------------------------------------------
    socket.on("getMessage", (msg) => {
      setALL_Chats((prev) => {
        const { conversationId, senderId, receiverId } = msg;
        if (!conversationId) return prev;

        const updated = [...prev];
        const idx = updated.findIndex((c) => c._id === conversationId);

        if (idx !== -1) {
          // Existing conversation → update messages, lastMessage, unread
          const chat = updated.splice(idx, 1)[0];

          const already = chat.messages?.find(
            (m) =>
              m._id === msg._id ||
              (msg.tempId && m.tempId && m.tempId === msg.tempId)
          );

          if (!already) {
            chat.messages = [...(chat.messages || []), msg];
          } else {
            // merge (e.g. optimistic → real)
            chat.messages = chat.messages.map((m) =>
              m._id === msg._id || (msg.tempId && m.tempId === msg.tempId)
                ? { ...m, ...msg }
                : m
            );
          }

          chat.lastMessage = msg;

          // increase unread only if message is from OTHER user
          if (senderId !== currentUser.$id) {
            chat.unreadCount = (chat.unreadCount || 0) + 1;
          }

          // move conversation to top
          return [chat, ...updated];
        }

        // New conversation from backend
        const isCurrentSender = senderId === currentUser.$id;
        const otherId = isCurrentSender ? receiverId : senderId;

        const user = {
          id: otherId,
          name: isCurrentSender
            ? msg.receiverName || "Unknown"
            : msg.senderName || "Unknown",
          image: isCurrentSender
            ? msg.receiverImage || ""
            : msg.senderImage || "",
        };

        const newChat = {
          _id: conversationId,
          participants: [senderId, receiverId], // Appwrite ids here
          messages: [msg],
          lastMessage: msg,
          unreadCount: isCurrentSender ? 0 : 1,
          user, // "other" user relative to current user
        };

        return [newChat, ...prev];
      });
    });

    // ---------------------------------------------------
    // TYPING
    // ---------------------------------------------------
    socket.on("typing", ({ conversationId, senderId, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (isTyping) next.set(senderId, conversationId);
        else next.delete(senderId);
        return next;
      });
    });

    // ---------------------------------------------------
    // MESSAGE SEEN
    // ---------------------------------------------------
    socket.on("messageSeen", ({ conversationId, messageId }) => {
      setALL_Chats((prev) =>
        prev.map((chat) => {
          if (chat._id !== conversationId) return chat;

          const messages = chat.messages?.map((m) =>
            m._id === messageId || m.tempId === messageId
              ? { ...m, status: "seen" }
              : m
          );

          return {
            ...chat,
            messages,
            unreadCount: 0,
          };
        })
      );
    });

    // --------------------------
    // Online/offline status
    // --------------------------
    socket.on("userOnline", ({ userId, status }) =>
      setOnlineUsers((prev) => new Map(prev).set(userId, status))
    );

    socket.on("userOffline", ({ userId }) =>
      setOnlineUsers((prev) => {
        const updated = new Map(prev);
        updated.delete(userId);
        return updated;
      })
    );

    socket.on("userStatusChanged", ({ userId, status }) =>
      setOnlineUsers((prev) => {
        const updated = new Map(prev);
        if (updated.has(userId)) updated.set(userId, status);
        return updated;
      })
    );

    return () => socket.disconnect();
  }, [currentUser?.$id, User_Status]);

  // ---------------------------------------------------
  // SEND MESSAGE  (only emit, do NOT mutate ALL_Chats here)
  // messageData comes from ChatScreen optimistic object
  // ---------------------------------------------------
  const sendMessageToServer = useCallback(
    (messageData) => {
      if (!socketRef.current?.connected || !currentUser || !messageData?.receiverId) return;

      socketRef.current.emit("sendMessage", {
        tempId: messageData.tempId || null,
        conversationId: messageData.conversationId || null, // null => server creates new
        senderId: currentUser.$id,
        receiverId: messageData.receiverId,
        text: messageData.text,
        type: messageData.type || "text",
        // extra meta to help client build UI
        senderName: messageData.senderName || currentUser.User_Name,
        senderImage: messageData.senderImage || currentUser.User_Profile_Picture,
        receiverName: messageData.receiverName || "",
        receiverImage: messageData.receiverImage || "",
      });
    },
    [currentUser]
  );

  // ---------------------------------------------------
  // SEND TYPING STATUS
  // ---------------------------------------------------
  const sendTypingStatus = useCallback(
    (conversationId, isTyping) => {
      if (!socketRef.current?.connected || !currentUser) return;

      socketRef.current.emit("typing", {
        conversationId,
        senderId: currentUser.$id,
        isTyping,
      });
    },
    [currentUser]
  );

  // ---------------------------------------------------
  // MARK CHAT AS SEEN (and notify server)
  // ---------------------------------------------------
  const markChatAsSeen = useCallback(
    (conversationId) => {
      if (!conversationId || !socketRef.current || !currentUser) return;

      const messageIdsToMark = [];

      setALL_Chats((prev) =>
        prev.map((chat) => {
          if (chat._id !== conversationId) return chat;

          const updatedMessages = (chat.messages || []).map((m) => {
            if (m.senderId !== currentUser.$id && m.status !== "seen") {
              if (m._id) messageIdsToMark.push(m._id);
              return { ...m, status: "seen" };
            }
            return m;
          });

          return {
            ...chat,
            messages: updatedMessages,
            unreadCount: 0,
          };
        })
      );

      // emit after state calc
      messageIdsToMark.forEach((messageId) => {
        socketRef.current?.emit("messageSeen", {
          conversationId,
          messageId,
          userId: currentUser.$id,
        });
      });
    },
    [currentUser]
  );

  // ---------------------------------------------------
  // STATUS HELPERS (unchanged)
  // ---------------------------------------------------
  const updateUserStatus = useCallback(
    (status) => {
      if (socketRef.current?.connected && currentUser?.$id) {
        socketRef.current.emit("updateStatus", { userId: currentUser.$id, status });
      }
    },
    [currentUser]
  );

  const isUserOnline = useCallback(
    (userId) => onlineUsers.has(userId),
    [onlineUsers]
  );

  const getUserStatus = useCallback(
    (userId) => onlineUsers.get(userId) || "offline",
    [onlineUsers]
  );

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        ALL_Chats,
        fetchChats,
        sendMessageToServer,
        onlineUsers,
        updateUserStatus,
        isUserOnline,
        getUserStatus,
        typingUsers,
        sendTypingStatus,
        markChatAsSeen,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
