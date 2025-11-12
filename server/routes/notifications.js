import express from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearMessageNotifications,
  getUnreadCount,
} from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:userId", verifyToken, getUserNotifications);
router.get("/:userId/unread-count", verifyToken, getUnreadCount);

/* UPDATE */
router.patch("/:notificationId/read", verifyToken, markAsRead);
router.patch("/:userId/read-all", verifyToken, markAllAsRead);

/* DELETE */
router.delete("/:notificationId", verifyToken, deleteNotification);
router.delete("/:userId/clear-message/:senderId", verifyToken, clearMessageNotifications);

export default router;
