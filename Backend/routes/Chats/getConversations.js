// routes/getConversations.js
const express = require("express");
const router = express.Router();
const { ChatModel } = require("../../config/DB");

/**
 * POST /getConversations
 * Body: { userId }
 */
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const conversations = await ChatModel.find({ participants: userId })
      .sort({ updatedAt: -1 }) // latest updated first
      .lean();

    return res.status(200).json(conversations);
  } catch (err) {
    console.error("❌ getConversations error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
