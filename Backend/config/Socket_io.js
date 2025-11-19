const { Server } = require("socket.io");
const { UserModel, ChatModel, MessageModel } = require("./DB");

// 🧠 In-memory map: userId -> { socketId, status }
const onlineUsers = new Map();

/**
 * Initialize Socket.IO and attach it to an existing HTTP server.
 * @param {http.Server} socket_server - The already created HTTP server.
 */



async function updateUsersChatLists(senderId, receiverId, conversationId) {
  try {
    // 1️⃣ Add conversationId to sender PRIMARY if not exists
    await UserModel.findOneAndUpdate(
      { User_$ID: senderId, "User_Chats.primary": { $ne: conversationId } },
      { $addToSet: { "User_Chats.primary": conversationId } },
      { new: true }
    );

    // 2️⃣ Add conversationId to receiver REQUESTS if not exists
    await UserModel.findOneAndUpdate(
      { User_$ID: receiverId, "User_Chats.requests": { $ne: conversationId } },
      { $addToSet: { "User_Chats.requests": conversationId } },
      { new: true }
    );
  }
  catch (error) {
    console.error("❌ updateUsersChatLists error:", error);
  }
}


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

      // ------------------------
      // Add user
      // ------------------------
      socket.on("addUser", ({ User_$ID, User_Status }) => {
        if (!User_$ID) return;

        onlineUsers.set(User_$ID, {
          socketId: socket.id,
          status: User_Status || "online",
        });

        io.emit("userOnline", { userId: User_$ID, status: User_Status });
      });

      // ------------------------
      // Send message
      // ------------------------
      socket.on("sendMessage", async (msg) => {
        try {
          let { conversationId, senderId, receiverId, text, type = "text" } = msg;

          if (!senderId || !receiverId || !text) return;

          // 1️⃣ Create conversation if it doesn't exist
          if (!conversationId) {
            const newConversation = await ChatModel.create({
              ConversationType: "direct",
              participants: [senderId, receiverId],
              status: "accepted",
              lastMessage: {
                text,
                sender: senderId,
                createdAt: new Date(),
              },
            });

            conversationId = newConversation._id.toString();

            await updateUsersChatLists(senderId, receiverId, conversationId);

          }

          // 2️⃣ Save message to MongoDB
          const messageDocument = await MessageModel.create({
            conversationId,
            senderId,
            text,
            type,
            seenBy: [senderId], // sender already “saw” it
          });

          // 3️⃣ Update conversation lastMessage
          await ChatModel.findByIdAndUpdate(conversationId, {
            lastMessage: {
              text,
              sender: senderId,
              createdAt: messageDocument.createdAt,
            },
          });

          // 4️⃣ Prepare message to send back to users
          const messageToSend = {
            _id: messageDocument._id.toString(),
            conversationId,
            senderId,
            receiverId,
            text,
            type,
            time: messageDocument.createdAt,
            status: "delivered",
          };

          // 5️⃣ Send to the sender (confirmation)
          io.to(socket.id).emit("getMessage", messageToSend);

          // 6️⃣ Send to the receiver if online
          const receiver = onlineUsers.get(receiverId);
          if (receiver?.socketId) {
            io.to(receiver.socketId).emit("getMessage", messageToSend);
          }

          console.log(`[Socket] ${senderId} → ${receiverId}: ${text}`);
        } catch (error) {
          console.error("❌ sendMessage error:", error);
        }
      });

      // ------------------------
      // Typing indicator
      // ------------------------
      socket.on("typing", ({ conversationId, senderId, isTyping }) => {
        socket.broadcast.emit("typing", { conversationId, senderId, isTyping });
      });

      // -------------------------
      // SEEN MESSAGE
      // -------------------------
      socket.on("messageSeen", async ({ conversationId, messageId, userId }) => {
        try {
          await MessageModel.findByIdAndUpdate(messageId, {
            $addToSet: { seenBy: userId },
          });

          socket.broadcast.emit("messageSeen", { conversationId, messageId });
        } catch (error) {
          console.error("❌ messageSeen error:", error);
        }
      });

      // ------------------------
      // Update user status
      // ------------------------
      socket.on("updateStatus", ({ userId, status }) => {
        if (onlineUsers.has(userId)) {
          onlineUsers.set(userId, { ...onlineUsers.get(userId), status });
          io.emit("userStatusChanged", { userId, status });
        }
      });

      // ------------------------
      // Disconnect
      // ------------------------
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
