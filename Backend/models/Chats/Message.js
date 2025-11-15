// models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // message types: text | file | image | voice | system
    type: {
      type: String,
      enum: ["text", "image", "file", "voice", "system"],
      default: "text",
    },

    text: { type: String, default: "" },

    // file / image url or storage reference
    attachments: [
      {
        url: String,
        mimeType: String,
        filename: String,
        size: Number,
      }
    ],

    // voice-specific fields (keep for voice messages)
    isVoiceMessage: { type: Boolean, default: false },
    sound: { type: Object, default: null },
    duration: { type: Number, default: 0 }, // seconds (Number)
    durationDisplay: { type: String, default: "" },

    // If message is a reply to another message
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "message" },

    // who has seen this message
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    // edits / delete flags
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },

    // extra meta (reactions, encryption flags, etc.)
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// Indexes to accelerate loading conversation messages and unread counts
MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ conversationId: 1, sender: 1, createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
