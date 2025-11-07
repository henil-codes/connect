import express from "express";
import {
  getUser,
  getAllUsers,
  getUserFriends,
  updateUser,
  changePassword,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendRequests,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/all", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/friend-requests", verifyToken, getFriendRequests);

/* UPDATE */
router.patch("/:id", verifyToken, updateUser);
router.patch("/:id/password", verifyToken, changePassword);

/* FRIEND REQUESTS */
router.post("/:id/friend-request/:friendId", verifyToken, sendFriendRequest);
router.patch("/:id/accept-friend/:friendId", verifyToken, acceptFriendRequest);
router.patch("/:id/decline-friend/:friendId", verifyToken, declineFriendRequest);
router.delete("/:id/remove-friend/:friendId", verifyToken, removeFriend);

export default router;