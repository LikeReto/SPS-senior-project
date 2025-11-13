const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ],

    // ✅ Track who accepted the chat
    acceptedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    // ✅ Request status: pending, accepted, declined
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },

    // ✅ Store last message preview for chat list performance
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: Date,
    }
  },
  { timestamps: true }
);

// Create an index to optimize queries for conversations involving specific participants
ConversationSchema.index({ participants: 1 });


module.exports = ConversationSchema; // ✅ Export only the schema
