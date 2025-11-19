const mongoose = require("mongoose");
require("dotenv/config");

// ✅ Load schemas
const User_Schema = require("../models/Auth/User_Schema");
const Chat_Schema = require("../models/Chats/Conversation");
const Message_Schema = require("../models/Chats/Message");


// ✅ Log if MongoDB URLs are available in environment variables
console.log("🔍 Users_MONGO_URL:", process.env.Users_MONGO_URL ? "✅ Loaded" : "❌ Not Found");

// ✅ Create separate connections for each database
const Users_DB = mongoose.createConnection(process.env.Users_MONGO_URL);

// ✅ Attach schemas to connections as models
const UserModel = Users_DB.model("users", User_Schema);
const ChatModel = Users_DB.model("conversations", Chat_Schema);
const MessageModel = Users_DB.model("messages", Message_Schema);

// ✅ Connect to databases
const Init_MongoDB = async () => {
    try {
        // Connecting to Users Database
        console.log("⌚ Connecting to Users MongoDB...");
        await Users_DB.openUri(process.env.Users_MONGO_URL);
        console.log("✅ Connected to Users MongoDB");

        // Initialize UserModel and create indexes
        await UserModel.init();
        await UserModel.createIndexes(); // Ensure indexes are created
        const Users_indexes = await UserModel.collection.indexes();
        Users_indexes ? console.log("✅ Indexes created successfully for User_Schema!") : console.log("❌ Failed to create Indexes for User_Schema!");

        // Initialize ChatModel and create indexes
        await ChatModel.init();
        await ChatModel.createIndexes();
        const Chats_indexes = await ChatModel.collection.indexes();
        Chats_indexes ? console.log("✅ Indexes created successfully for Chat_Schema!") : console.log("❌ Failed to create Indexes for Chat_Schema!");

        // Initialize MessageModel and create indexes
        await MessageModel.init();
        await MessageModel.createIndexes();
        const Messages_indexes = await MessageModel.collection.indexes();
        Messages_indexes ? console.log("✅ Indexes created successfully for Message_Schema!") : console.log("❌ Failed to create Indexes for Message_Schema!");

        console.log("🎉 All MongoDB connections established successfully!");

        return true;
    }
    catch (error) {
        // Enhanced error logging with more details
        console.error(`❌ MongoDB Connection Error: ${error.message || error}`);
        throw error; // Re-throw the error to ensure it's propagated
    }
};

module.exports = {
    Init_MongoDB,
    UserModel,
    ChatModel,
    MessageModel,
};