import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  useTheme,
  Chip,
} from "@mui/material";
import { ArrowBack, Send } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getImageUrl } from "../../utils/imageHelper";
import { useSocket } from "../../context/SocketContext";

const ChatWindow = ({ userId, conversation, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const { socket, onlineUsers } = useSocket();
  
  const MAX_MESSAGE_LENGTH = 1000;

  const fetchMessages = async () => {
    if (!conversation) return;

    try {
      const response = await fetch(
        `http://localhost:3001/messages/${userId}/with/${conversation.partnerId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMessages(data);

      // Mark messages as read
      await fetch(
        `http://localhost:3001/messages/${userId}/read/${conversation.partnerId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear message notifications from this sender
      await fetch(
        `http://localhost:3001/notifications/${userId}/clear-message/${conversation.partnerId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Socket.IO listeners
  useEffect(() => {
    if (!socket || !conversation) return;

    // Listen for incoming messages
    const handleReceiveMessage = (message) => {
      if (
        message.senderId === conversation.partnerId ||
        message.recipientId === conversation.partnerId
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Listen for message sent confirmation
    const handleMessageSent = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    // Listen for typing indicator
    const handleUserTyping = (data) => {
      if (data.userId === conversation.partnerId) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("user_typing", handleUserTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("user_typing", handleUserTyping);
    };
  }, [socket, conversation]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || loading || !socket) return;

    // Validate message length
    if (newMessage.trim().length > MAX_MESSAGE_LENGTH) {
      setError(`Message must be ${MAX_MESSAGE_LENGTH} characters or less`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Save to database
      const response = await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userId,
          recipientId: conversation.partnerId,
          text: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        
        // Send via Socket.IO for real-time delivery
        socket.emit("send_message", savedMessage);
        
        setNewMessage("");
        
        // Stop typing indicator
        socket.emit("typing", {
          userId,
          recipientId: conversation.partnerId,
          isTyping: false,
        });
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    setError("");

    if (!socket) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    socket.emit("typing", {
      userId,
      recipientId: conversation.partnerId,
      isTyping: true,
    });

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        userId,
        recipientId: conversation.partnerId,
        isTyping: false,
      });
    }, 2000);
  };

  const getMessageTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!conversation) {
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="text.secondary">
          Select a conversation to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Header */}
      <Box
        p="1rem 1.5rem"
        borderBottom="1px solid"
        borderColor="neutral.light"
        display="flex"
        alignItems="center"
        gap="1rem"
      >
        <IconButton onClick={onBack} sx={{ display: { md: "none" } }}>
          <ArrowBack />
        </IconButton>
        <Box position="relative">
          <Avatar
            src={getImageUrl(conversation.partnerPicture)}
            sx={{ width: 40, height: 40 }}
          />
          {onlineUsers.has(conversation.partnerId) && (
            <Box
              position="absolute"
              bottom={0}
              right={0}
              width={12}
              height={12}
              borderRadius="50%"
              backgroundColor="#00BA7C"
              border="2px solid"
              borderColor="background.paper"
            />
          )}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="600">
            {conversation.partnerName}
          </Typography>
          {onlineUsers.has(conversation.partnerId) && (
            <Typography variant="caption" color="text.secondary">
              Online
            </Typography>
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box
        flex={1}
        overflow="auto"
        p="1.5rem"
        display="flex"
        flexDirection="column"
        gap="1rem"
      >
        {messages.map((message) => {
          const isOwn = message.senderId === userId;
          return (
            <Box
              key={message._id}
              display="flex"
              justifyContent={isOwn ? "flex-end" : "flex-start"}
            >
              <Box
                maxWidth="70%"
                p="0.75rem 1rem"
                borderRadius="18px"
                backgroundColor={
                  isOwn
                    ? theme.palette.primary.main
                    : theme.palette.background.alt
                }
                color={isOwn ? "white" : "text.primary"}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    fontSize: "0.7rem",
                    mt: "0.25rem",
                    display: "block",
                  }}
                >
                  {getMessageTime(message.createdAt)}
                </Typography>
              </Box>
            </Box>
          );
        })}
        
        {/* Typing Indicator */}
        {isTyping && (
          <Box display="flex" justifyContent="flex-start">
            <Chip
              label="typing..."
              size="small"
              sx={{
                backgroundColor: theme.palette.background.alt,
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        p="1rem 1.5rem"
        borderTop="1px solid"
        borderColor="neutral.light"
      >
        {error && (
          <Typography color="error" variant="caption" sx={{ display: "block", mb: "0.5rem" }}>
            {error}
          </Typography>
        )}
        <Box display="flex" gap="1rem" alignItems="center">
          <Box flex={1}>
            <InputBase
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              multiline
              maxRows={4}
              sx={{
                width: "100%",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "20px",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
              }}
            />
            <Typography 
              variant="caption" 
              color={newMessage.length > MAX_MESSAGE_LENGTH ? "error" : "text.secondary"}
              sx={{ display: "block", mt: "0.25rem", ml: "1rem" }}
            >
              {newMessage.length}/{MAX_MESSAGE_LENGTH}
            </Typography>
          </Box>
          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loading || newMessage.length > MAX_MESSAGE_LENGTH}
            sx={{
              backgroundColor: (newMessage.trim() && newMessage.length <= MAX_MESSAGE_LENGTH)
                ? theme.palette.primary.main
                : theme.palette.neutral.light,
              color: (newMessage.trim() && newMessage.length <= MAX_MESSAGE_LENGTH) ? "white" : theme.palette.neutral.medium,
              "&:hover": {
                backgroundColor: (newMessage.trim() && newMessage.length <= MAX_MESSAGE_LENGTH)
                  ? theme.palette.primary.dark
                  : theme.palette.neutral.light,
              },
              "&:disabled": {
                backgroundColor: theme.palette.neutral.light,
                color: theme.palette.neutral.medium,
              },
            }}
          >
            <Send sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;
