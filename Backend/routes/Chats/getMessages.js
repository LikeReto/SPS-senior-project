// routes/getMessages.js
const express = require("express");
const router = express.Router();
const MessageModel = require("../../models/Chats/Message");

/**
 * GET /getMessages/:chatId
 * Returns all messages for a conversation
 */
router.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) return res.status(400).json({ error: "chatId is required" });

    // Fetch messages sorted by creation time
    const messages = await MessageModel.find({ conversationId: chatId })
      .sort({ createdAt: 1 }) // oldest first
      .lean();

    return res.status(200).json(messages);
  } catch (error) {
    console.error("❌ getMessages error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
