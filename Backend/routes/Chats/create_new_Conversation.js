// routes/Chats/create_new_Conversation.js
const router = require("express").Router();
const { ChatModel, MessageModel, UserModel } = require("../../config/DB");

router.get("/", (req, res) => {
    res.send("🚀 file: create_new_Conversation.js ~> / page: create_new_Conversation");
});
// Create a new conversation AFTER the first message
router.post("/", async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        if (!senderId || !receiverId || !text) {
            return res.status(400).json({ error: "senderId, receiverId, and text are required." });
        }

        // Step 1: Check if conversation already exists (accepted or pending)
        let conversation = await ChatModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (conversation) {
            return res.status(409).json({
                error: "Conversation already exists.",
                conversationId: conversation._id
            });
        }

        // Step 2: Create conversation
        conversation = await ChatModel.create({
            participants: [senderId, receiverId],
            initiator: senderId,
            status: "pending",
            lastMessage: {
                text,
                sender: senderId,
                createdAt: new Date()
            },
            lastMessageAt: new Date()
        });

        // Step 3: Save first message
        const message = await MessageModel.create({
            conversationId: conversation._id,
            sender: senderId,
            text,
            type: "text",
            createdAt: new Date()
        });

        // Step 4: Add conversation to Sender's primary chats
        await UserModel.findByIdAndUpdate(senderId, {
            $addToSet: { "User_Chats.Favorites_Chats": conversation._id }
        });

        return res.status(200).json({
            message: "Conversation created successfully",
            conversation,
            firstMessage: message
        });

    } catch (error) {
        console.error("❌ Error in create conversation:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
