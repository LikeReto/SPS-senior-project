// routes/getConversations.js
const express = require("express");
const router = express.Router();
const { UserModel, ChatModel, MessageModel } = require("../../config/DB");


// 🧠 Lazy load MessageModel to avoid circular dependencie  s
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    // 1️⃣ Load user & chat IDs
    const user = await UserModel.findOne({ User_$ID: userId });

    if (!user) return res.status(404).json({ error: "User not found" });

    const { primary, general, requests } = user.User_Chats;

    // Merge all conversation ids
    const allIds = [...primary, ...general, ...requests];

    // 2️⃣ Fetch all conversations
    let conversations = await ChatModel.find({
      _id: { $in: allIds },
    }).lean();

    // 3️⃣ Attach messages + user data
    const results = [];

    for (let conv of conversations) {
      const messages = await MessageModel.find({
        conversationId: conv._id.toString(),
      })
        .sort({ createdAt: 1 })
        .lean();

      const otherUserId = conv.participants.find((id) => id !== userId);

      const otherUser = await UserModel.findOne({ User_$ID: otherUserId })
        .select("User_Name User_Profile_Picture User_$ID")
        .lean();

      let type = "primary";
      if (general.includes(conv._id.toString())) type = "general";
      if (requests.includes(conv._id.toString())) type = "requests";

      results.push({
        ...conv,
        type,
        messages,
        user: {
          id: otherUser?.User_$ID,
          name: otherUser?.User_Name,
          image: otherUser?.User_Profile_Picture,
        },
      });
    }

    return res.status(200).json({ conversations: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;