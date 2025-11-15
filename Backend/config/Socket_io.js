const { Server } = require("socket.io");
const { ChatModel } = require("./DB");
const MessageModel = require("../models/Chats/Message");

// 🧠 In-memory map: userId -> { socketId, status }
const onlineUsers = new Map();

/**
 * Initialize Socket.IO and attach it to an existing HTTP server.
 * @param {http.Server} socket_server - The already created HTTP server.
 */
async function Socket_io(socket_server) {
  try {
    console.log("⌚ Initializing [Socket.io]...");

    const io = new Server(socket_server, {
      cors: { origin: "*" },
      pingInterval: 25000,
      pingTimeout: 20000,
      transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
      console.log(`🚀 Connected: ${socket.id}`);

      socket.on("addUser", ({ User_$ID, User_Status }) => {
        if (!User_$ID) return;

        onlineUsers.set(User_$ID, {
          socketId: socket.id,
          status: User_Status || "online",
        });

        io.emit("userOnline", { userId: User_$ID, status: User_Status });
      });

      socket.on("sendMessage", async (msg) => {
        const { chatId, senderId, receiverId, text, type = "text" } = msg;

        if (!chatId || !senderId || !receiverId) return;

        try {
          // --- Save to MongoDB ---
          const newMessage = await MessageModel.create({
            conversationId: chatId,
            senderId,
            type,
            text,
            createdAt: new Date(),
          });

          // --- Update lastMessage in conversation ---
          await ChatModel.findByIdAndUpdate(chatId, {
            lastMessage: {
              text,
              sender: senderId,
              createdAt: newMessage.createdAt,
            },
            status: "accepted",
          });

          // --- Emit to sender and receiver ---
          io.to(socket.id).emit("getMessage", newMessage);

          const receiver = onlineUsers.get(receiverId);
          if (receiver) io.to(receiver.socketId).emit("getMessage", newMessage);

          console.log(`[Message] ${senderId} → ${receiverId}: ${text}`);
        } catch (err) {
          console.error("❌ Error saving message:", err);
        }
      });

      socket.on("updateStatus", ({ userId, status }) => {
        if (onlineUsers.has(userId)) {
          onlineUsers.set(userId, { ...onlineUsers.get(userId), status });
          io.emit("userStatusChanged", { userId, status });
        }
      });

      socket.on("disconnect", () => {
        for (const [userId, data] of onlineUsers.entries()) {
          if (data.socketId === socket.id) {
            onlineUsers.delete(userId);
            io.emit("userOffline", { userId });
            break;
          }
        }
      });
    });

    console.log("✅ [Socket.io] Initialized successfully!");
  } catch (error) {
    console.error(`❌ Error in [Socket.io] Server: ${error}`);
  }
}

module.exports = { Socket_io };
