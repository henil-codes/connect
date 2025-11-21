import Message from "../models/Message.js";
import User from "../models/User.js";
import { createNotification } from "./notifications.js";

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, text } = req.body;

    // Validate message text
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (text.length > 1000) {
      return res.status(400).json({ message: "Message must be 1000 characters or less" });
    }

    // Verify both users exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify they are friends
    if (!sender.friends.includes(recipientId)) {
      return res.status(403).json({ message: "You can only message friends" });
    }

    // Create message
    const message = new Message({
      senderId,
      recipientId,
      text: text.trim(),
    });

    await message.save();

    // Check if there's already an unread message notification from this sender
    const Notification = (await import("../models/Notification.js")).default;
    const existingNotification = await Notification.findOne({
      recipientId,
      senderId,
      type: "message",
      read: false,
    });

    if (existingNotification) {
      // Update existing notification with new message count
      const messageCount = await Message.countDocuments({
        senderId,
        recipientId,
        read: false,
      });
      
      existingNotification.message = messageCount > 1 
        ? `sent you ${messageCount} messages`
        : `sent you a message`;
      existingNotification.createdAt = new Date(); // Update timestamp
      await existingNotification.save();
    } else {
      // Create new notification
      await createNotification(
        recipientId,
        senderId,
        `${sender.firstName} ${sender.lastName}`,
        sender.picturePath,
        "message",
        `sent you a message`,
        null
      );
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET CONVERSATIONS */
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    }).sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationsMap = new Map();

    for (const message of messages) {
      const partnerId = message.senderId === userId ? message.recipientId : message.senderId;
      
      if (!conversationsMap.has(partnerId)) {
        const partner = await User.findById(partnerId);
        
        // Count unread messages from this partner
        const unreadCount = await Message.countDocuments({
          senderId: partnerId,
          recipientId: userId,
          read: false,
        });

        conversationsMap.set(partnerId, {
          partnerId,
          partnerName: `${partner.firstName} ${partner.lastName}`,
          partnerPicture: partner.picturePath,
          lastMessage: message.text,
          lastMessageTime: message.createdAt,
          unreadCount,
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET MESSAGES WITH USER */
export const getMessagesWithUser = async (req, res) => {
  try {
    const { userId, partnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: partnerId },
        { senderId: partnerId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* MARK MESSAGES AS READ */
export const markAsRead = async (req, res) => {
  try {
    const { userId, partnerId } = req.params;

    await Message.updateMany(
      {
        senderId: partnerId,
        recipientId: userId,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET UNREAD COUNT */
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Message.countDocuments({
      recipientId: userId,
      read: false,
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
