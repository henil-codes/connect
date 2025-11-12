import Notification from "../models/Notification.js";

/* CREATE NOTIFICATION */
export const createNotification = async (recipientId, senderId, senderName, senderPicture, type, message, postId = null) => {
  try {
    // Don't create notification if user is interacting with their own post
    if (recipientId === senderId) {
      return null;
    }

    const notification = new Notification({
      recipientId,
      senderId,
      senderName,
      senderPicture,
      type,
      message,
      postId,
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    return null;
  }
};

/* GET USER NOTIFICATIONS */
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* MARK NOTIFICATION AS READ */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* MARK ALL AS READ */
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { recipientId: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE NOTIFICATION */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.findByIdAndDelete(notificationId);
    
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CLEAR MESSAGE NOTIFICATIONS FROM SPECIFIC SENDER */
export const clearMessageNotifications = async (req, res) => {
  try {
    const { userId, senderId } = req.params;
    
    await Notification.deleteMany({
      recipientId: userId,
      senderId: senderId,
      type: "message",
    });
    
    res.status(200).json({ message: "Message notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET UNREAD COUNT */
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({ 
      recipientId: userId, 
      read: false 
    });
    
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
