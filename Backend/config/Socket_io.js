const { Server } = require("socket.io");

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

    // ✅ Connection event
    io.on("connection", (socket) => {
      console.log(`🚀 [Socket.io] 🟢 Connected: ${socket.id}`);

      /**
       * 🟢 Add user to online map
       * userConnection = { User_$ID, User_Status }
       */
      socket.on("addUser", (userConnection) => {
        const { User_$ID, User_Status } = userConnection;
        if (!User_$ID) return;

        // Store or update
        onlineUsers.set(User_$ID, {
          socketId: socket.id,
          status: User_Status || "online",
        });

        console.log(`✅ User [${User_$ID}] is online as [${User_Status}]`);
        console.log(`[Online Users]: ${onlineUsers.size}`);

        // Notify all clients about this new online user
        io.emit("userOnline", { userId: User_$ID, status: User_Status });
      });

      /**
       * ✉️ Handle sending messages
       */
      socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const receiver = onlineUsers.get(receiverId);
        if (receiver) {
          io.to(receiver.socketId).emit("getMessage", {
            senderId,
            text,
          });
        } else {
          console.log(`❌ Receiver ${receiverId} is not online.`);
        }
      });

      /**
       * 🟠 Handle status updates
       */
      socket.on("updateStatus", ({ userId, status }) => {
        if (onlineUsers.has(userId)) {
          onlineUsers.set(userId, {
            ...onlineUsers.get(userId),
            status,
          });

          io.emit("userStatusChanged", { userId, status });
          console.log(`🔄 User [${userId}] changed status → ${status}`);
        }
      });

      /**
       * 🔴 Handle disconnection
       */
      socket.on("disconnect", () => {
        let disconnectedUserId = null;

        for (const [userId, data] of onlineUsers.entries()) {
          if (data.socketId === socket.id) {
            disconnectedUserId = userId;
            onlineUsers.delete(userId);
            break;
          }
        }

        if (disconnectedUserId) {
          console.log(`🚪 User [${disconnectedUserId}] disconnected.`);
          io.emit("userOffline", { userId: disconnectedUserId });
        }

        console.log(`[Online Users]: ${onlineUsers.size}`);
      });
    });

    console.log("✅ [Socket.io] Initialized successfully!");
  } catch (error) {
    console.error(`❌ Error in [Socket.io] Server: ${error}`);
  }
}

module.exports = { Socket_io };
