import mongoose from "mongoose";

/**
 * UserInteraction Schema tracks user engagement for feed personalization
 * This helps improve the feed algorithm by learning user preferences
 */
const UserInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    targetUserId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    interactionType: {
      type: String,
      enum: ['like', 'comment', 'view', 'share'],
      required: true,
    },
    weight: {
      type: Number,
      default: 1, // like: 1, comment: 2, share: 3
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
UserInteractionSchema.index({ userId: 1, targetUserId: 1 });
UserInteractionSchema.index({ userId: 1, createdAt: -1 });

const UserInteraction = mongoose.model("UserInteraction", UserInteractionSchema);
export default UserInteraction;