const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: String,
    file: String,
    isVoiceMessage: Boolean,
    sound: Object,
    duration: String, 
    durationDisplay: String,

    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  { timestamps: true }
);

// Create an index to optimize queries for fetching messages by conversationId and createdAt
MessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model("message", MessageSchema);
