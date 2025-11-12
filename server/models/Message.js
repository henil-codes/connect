import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    recipientId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
MessageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 });
MessageSchema.index({ recipientId: 1, read: 1 });

const Message = mongoose.model("Message", MessageSchema);
export default Message;
