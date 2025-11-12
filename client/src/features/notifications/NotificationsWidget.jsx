import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Notifications,
  FavoriteBorder,
  ChatBubbleOutline,
  PersonAdd,
  Check,
  Close,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { getImageUrl } from "../../utils/imageHelper";

const NotificationsWidget = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/notifications/${user._id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setNotifications(data);
      
      // Count unread
      const unread = data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:3001/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(
        `http://localhost:3001/notifications/${user._id}/read-all`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    setAnchorEl(null);
    
    // Navigate based on notification type
    if (notification.type === "message") {
      navigate(`/messages`);
    } else if (notification.postId) {
      navigate(`/home`);
    } else if (notification.type === "friend_request" || notification.type === "friend_accept") {
      navigate(`/profile/${notification.senderId}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <FavoriteBorder sx={{ fontSize: "1rem", color: "#F91880" }} />;
      case "comment":
        return <ChatBubbleOutline sx={{ fontSize: "1rem", color: theme.palette.primary.main }} />;
      case "message":
        return <ChatBubbleOutline sx={{ fontSize: "1rem", color: "#1DA1F2" }} />;
      case "friend_request":
      case "friend_accept":
        return <PersonAdd sx={{ fontSize: "1rem", color: "#00BA7C" }} />;
      default:
        return <Notifications sx={{ fontSize: "1rem" }} />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: theme.palette.primary.main + "10" },
          borderRadius: "50%",
          p: "0.75rem",
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: "360px",
            maxHeight: "500px",
            mt: 1,
          },
        }}
      >
        <Box p="1rem" display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="700">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer", fontWeight: 600 }}
              onClick={markAllAsRead}
            >
              Mark all read
            </Typography>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box p="2rem" textAlign="center">
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                py: "0.75rem",
                px: "1rem",
                backgroundColor: notification.read ? "transparent" : theme.palette.primary.main + "08",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main + "15",
                },
              }}
            >
              <Box display="flex" gap="0.75rem" width="100%">
                <Avatar
                  src={getImageUrl(notification.senderPicture)}
                  sx={{ width: 40, height: 40 }}
                />
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap="0.5rem">
                    {getNotificationIcon(notification.type)}
                    <Typography variant="body2" fontWeight="600">
                      {notification.senderName}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: "0.25rem" }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getTimeAgo(notification.createdAt)}
                  </Typography>
                </Box>
                {!notification.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationsWidget;
