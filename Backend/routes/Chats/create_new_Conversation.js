const router = require("express").Router();
const { ChatModel, UserModel } = require("../../config/DB");

router.get("/", (request, response) => {
    response.send("🚀 file: Update_Current_User_Profile.js ~> / page: Update_Current_User_Profile")
});

router.post("/", async (request, response) => {
    try {
        const { participants } = request.body; // array of user IDs
        if (!participants || participants.length !== 2) {
            return res.status(400).json({ error: "Two participants are required." });
        }

        const [user1, user2] = participants;

        // Check if conversation already exists between these two users
        let conversation = await ChatModel.findOne({
            participants: { $all: [user1, user2] }
        }).populate("participants", "User_Name"); // Populate participant details

        if (!conversation) {
            // Create new conversation
            conversation = new ChatModel({
                participants,
                status: "pending",
            });
            await conversation.save();
        }

        return response.status(200).json({ conversation });
    }
    catch (error) {
        console.error("❌ Error in create_new_Conversation.js:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;