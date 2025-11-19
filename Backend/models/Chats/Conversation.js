const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    ConversationType: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    ConversationTitle: {
      type: String,
      default: "",
    },

    participants: [
      {
        type: String,
        ref: "users", // ✔ matches Users_DB.model("users")
        required: true,
      }
    ],

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },

    lastMessage: {
      text: String,
      sender: { type: String, ref: "users" }, // ✔ correct
      createdAt: Date,
    }
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

module.exports = ConversationSchema;
