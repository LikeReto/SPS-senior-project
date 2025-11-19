// models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversations",   // ✔ MUST match model name
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      ref: "users",           // ✔ MUST match model name
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "voice", "system"],
      default: "text",
    },

    text: { type: String, default: "" },

    attachments: [
      {
        url: String,
        mimeType: String,
        filename: String,
        size: Number,
      }
    ],

    isVoiceMessage: { type: Boolean, default: false },
    sound: { type: Object, default: null },
    duration: { type: Number, default: 0 },
    durationDisplay: { type: String, default: "" },

    replyTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "messages"            // ✔ MUST match model name
    },

    seenBy: [
      {
        type: String,
        ref: "users",             // ✔ FIXED
      }
    ],

    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },

    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ conversationId: 1, senderId: 1, createdAt: -1 });

module.exports = MessageSchema;
