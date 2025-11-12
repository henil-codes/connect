import { useState, useEffect } from "react";
import { IconButton, Badge, useTheme } from "@mui/material";
import { Message } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MessagesWidget = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/messages/${user._id}/unread-count`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <IconButton
      onClick={() => navigate("/messages")}
      sx={{
        backgroundColor: "transparent",
        "&:hover": { backgroundColor: theme.palette.primary.main + "10" },
        borderRadius: "50%",
        p: "0.75rem",
      }}
    >
      <Badge badgeContent={unreadCount} color="error">
        <Message sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
      </Badge>
    </IconButton>
  );
};

export default MessagesWidget;
