import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import { Check, Close, Person } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setUser } from "../../state";
import WidgetWrapper from "../../components/ui/WidgetWrapper";
import FlexBetween from "../../components/ui/FlexBetween";

const FriendRequestsWidget = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const getFriendRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/friend-requests`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setFriendRequests(data.received || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, []);

  const handleAcceptRequest = async (friendId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/accept-friend/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update user state with new friends list and remove from received requests
        // Update friends list and remove from friend requests
        dispatch(setFriends({ friends: data.friends }));
        const updatedUser = {
          ...user,
          friendRequestsReceived: (user.friendRequestsReceived || []).filter(id => id !== friendId)
        };
        dispatch(setUser({ user: updatedUser }));
        // Remove from friend requests display
        setFriendRequests(prev => prev.filter(req => req._id !== friendId));
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async (friendId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/decline-friend/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update user state to remove from received requests
        const updatedUser = {
          ...user,
          friendRequestsReceived: (user.friendRequestsReceived || []).filter(id => id !== friendId)
        };
        dispatch(setUser({ user: updatedUser }));
        // Remove from friend requests display
        setFriendRequests(prev => prev.filter(req => req._id !== friendId));
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  if (friendRequests.length === 0) {
    return null; // Don't show widget if no requests
  }

  return (
    <WidgetWrapper>
      <Box display="flex" alignItems="center" gap="0.5rem" mb="1rem">
        <Person color="primary" />
        <Typography
          color="text.primary"
          variant="h6"
          fontWeight="600"
        >
          Friend Requests
        </Typography>
        <Box
          sx={{
            backgroundColor: palette.primary.main,
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: "600",
          }}
        >
          {friendRequests.length}
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap="1rem">
        {friendRequests.map((request, index) => (
          <Box key={request._id}>
            <FlexBetween>
              <Box
                display="flex"
                alignItems="center"
                gap="0.75rem"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${request._id}`)}
              >
                <Avatar
                  src={`http://localhost:3001/assets/${request.picturePath}`}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    color="text.primary"
                    sx={{
                      "&:hover": { textDecoration: "underline" },
                      fontSize: "0.9375rem",
                    }}
                  >
                    {request.firstName} {request.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.8125rem" }}
                  >
                    {request.occupation}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap="0.5rem">
                <Button
                  size="small"
                  variant="contained"
                  disabled={loading}
                  onClick={() => handleAcceptRequest(request._id)}
                  sx={{
                    minWidth: "36px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: palette.primary.main,
                    "&:hover": {
                      backgroundColor: palette.primary.dark,
                    },
                  }}
                >
                  <Check sx={{ fontSize: "1rem" }} />
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={loading}
                  onClick={() => handleDeclineRequest(request._id)}
                  sx={{
                    minWidth: "36px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    borderColor: palette.neutral.medium,
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "#F4212E10",
                      borderColor: "#F4212E",
                      color: "#F4212E",
                    },
                  }}
                >
                  <Close sx={{ fontSize: "1rem" }} />
                </Button>
              </Box>
            </FlexBetween>
            {index < friendRequests.length - 1 && (
              <Divider sx={{ mt: "1rem" }} />
            )}
          </Box>
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendRequestsWidget;