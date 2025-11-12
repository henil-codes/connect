import express from "express";
import {
  sendMessage,
  getConversations,
  getMessagesWithUser,
  markAsRead,
  getUnreadCount,
} from "../controllers/messages.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, sendMessage);

/* READ */
router.get("/:userId/conversations", verifyToken, getConversations);
router.get("/:userId/with/:partnerId", verifyToken, getMessagesWithUser);
router.get("/:userId/unread-count", verifyToken, getUnreadCount);

/* UPDATE */
router.patch("/:userId/read/:partnerId", verifyToken, markAsRead);

export default router;
