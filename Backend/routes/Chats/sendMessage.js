// routes/sendMessage.js
const express = require("express");
const router = express.Router();
const { ChatModel, UserModel } = require("../../config/DB");
const MessageModel = require("../../models/Chats/Message");

router.post("/", async (req, res) => {
  try {
    let { chatId, senderId, receiverId, text, type = "text", attachments = [] } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "senderId and receiverId are required." });
    }

    if (!chatId) {
      let conversation = await ChatModel.findOne({
        ConversationType: "direct",
        participants: { $all: [senderId, receiverId], $size: 2 },
      });

      if (!conversation) {
        conversation = await ChatModel.create({
          ConversationType: "direct",
          participants: [senderId, receiverId],
          status: "accepted",
        });
      }
      chatId = conversation._id;
    }

    const newMessage = await MessageModel.create({
      conversationId: chatId,
      senderId,
      type,
      text,
      attachments,
      createdAt: new Date(),
    });

    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: { text, sender: senderId, createdAt: newMessage.createdAt },
    });

    return res.status(200).json({ ...newMessage.toObject(), chatId });
  } catch (error) {
    console.error("❌ sendMessage error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
