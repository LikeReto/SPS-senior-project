// routes/sendMessage.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ChatModel, UserModel } = require("../../config/DB");
const MessageModel = require("../../models/Chats/Message");

router.post("/", async (req, res) => {
  try {
    let { chatId, senderId, receiverId, text = "", type = "text", attachments = [] } = req.body;

    // Validate required fields
    if (!senderId || !receiverId) return res.status(400).json({ error: "senderId and receiverId are required." });
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId))
      return res.status(400).json({ error: "Invalid senderId or receiverId" });

    senderId = mongoose.Types.ObjectId(senderId);
    receiverId = mongoose.Types.ObjectId(receiverId);

    let conversation;

    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
      conversation = await ChatModel.findById(chatId);
    }

    // If conversation not found, try to find by participants (direct chat)
    if (!conversation) {
      conversation = await ChatModel.findOne({
        ConversationType: "direct",
        participants: { $all: [senderId, receiverId], $size: 2 },
      });

      // If still not found, create a new conversation
      if (!conversation) {
        conversation = await ChatModel.create({
          ConversationType: "direct",
          participants: [senderId, receiverId],
          status: "accepted",
        });
      }
    }

    chatId = conversation._id;

    // Save message
    const newMessage = await MessageModel.create({
      conversationId: chatId,
      senderId,
      type,
      text,
      attachments,
      createdAt: new Date(),
    });

    // Update lastMessage in Conversation
    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: { text, sender: senderId, createdAt: newMessage.createdAt },
    });

    return res.status(200).json({
      ...newMessage.toObject(),
      chatId,
      conversationId: chatId,
    });
  } catch (error) {
    console.error("❌ sendMessage error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
