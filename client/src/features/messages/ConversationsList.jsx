import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Badge,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getImageUrl } from "../../utils/imageHelper";
import { useSocket } from "../../context/SocketContext";

const ConversationsList = ({ userId, selectedConversation, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const { onlineUsers } = useSocket();

  const fetchConversations = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/messages/${userId}/conversations`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchFriends();
    
    // Refresh conversations every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartConversation = (friend) => {
    onSelectConversation({
      partnerId: friend._id,
      partnerName: `${friend.firstName} ${friend.lastName}`,
      partnerPicture: friend.picturePath,
      lastMessage: "",
      lastMessageTime: new Date(),
      unreadCount: 0,
    });
    setNewMessageDialogOpen(false);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Header */}
      <Box 
        p="1.5rem" 
        borderBottom="1px solid" 
        borderColor="neutral.light"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight="700">
          Messages
        </Typography>
        <IconButton
          onClick={() => setNewMessageDialogOpen(true)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <Edit sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Box>

      {/* Conversations */}
      <Box flex={1} overflow="auto">
        {loading ? (
          <Box p="2rem" textAlign="center">
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        ) : conversations.length === 0 ? (
          <Box p="2rem" textAlign="center">
            <Typography color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mt="0.5rem">
              Start a conversation with your friends!
            </Typography>
          </Box>
        ) : (
          conversations.map((conversation) => (
            <Box
              key={conversation.partnerId}
              onClick={() => onSelectConversation(conversation)}
              sx={{
                p: "1rem 1.5rem",
                cursor: "pointer",
                backgroundColor:
                  selectedConversation?.partnerId === conversation.partnerId
                    ? theme.palette.primary.main + "10"
                    : "transparent",
                borderBottom: "1px solid",
                borderColor: "neutral.light",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main + "08",
                },
                transition: "background-color 0.2s",
              }}
            >
              <Box display="flex" gap="1rem" alignItems="center">
                <Badge
                  badgeContent={conversation.unreadCount}
                  color="error"
                  overlap="circular"
                >
                  <Box position="relative">
                    <Avatar
                      src={getImageUrl(conversation.partnerPicture)}
                      sx={{ width: 48, height: 48 }}
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
                </Badge>

                <Box flex={1} minWidth={0}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight="600" noWrap>
                      {conversation.partnerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getTimeAgo(conversation.lastMessageTime)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{
                      fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* New Message Dialog */}
      <Dialog
        open={newMessageDialogOpen}
        onClose={() => setNewMessageDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>New Message</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List>
            {friends.length === 0 ? (
              <Box p="2rem" textAlign="center">
                <Typography color="text.secondary">
                  No friends to message
                </Typography>
              </Box>
            ) : (
              friends.map((friend) => (
                <ListItem key={friend._id} disablePadding>
                  <ListItemButton onClick={() => handleStartConversation(friend)}>
                    <ListItemAvatar>
                      <Box position="relative">
                        <Avatar src={getImageUrl(friend.picturePath)} />
                        {onlineUsers.has(friend._id) && (
                          <Box
                            position="absolute"
                            bottom={0}
                            right={0}
                            width={10}
                            height={10}
                            borderRadius="50%"
                            backgroundColor="#00BA7C"
                            border="2px solid white"
                          />
                        )}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${friend.firstName} ${friend.lastName}`}
                      secondary={friend.occupation}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ConversationsList;
