import { useState, useEffect } from "react";
import { Button, useTheme } from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined, Schedule } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setUser } from "../../state";

const FriendButton = ({ friendId }) => {
  const [friendStatus, setFriendStatus] = useState("none"); // none, pending, friends
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const { palette } = useTheme();

  // Check if this is the user's own profile
  const isOwnProfile = _id === friendId;

  // Fetch fresh friend status from server
  useEffect(() => {
    const checkFriendStatus = async () => {
      if (!friendId || !_id) return;
      
      try {
        // Fetch current user's data directly from server
        const response = await fetch(`http://localhost:3001/users/${_id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.json();
        
        // Check if friend
        const isFriend = userData.friends?.includes(friendId);
        
        // Check if request sent
        const requestSent = userData.friendRequestsSent?.includes(friendId);
        
        if (isFriend) {
          setFriendStatus("friends");
        } else if (requestSent) {
          setFriendStatus("pending");
        } else {
          setFriendStatus("none");
        }
      } catch (error) {
        console.error("Error checking friend status:", error);
      }
    };
    
    checkFriendStatus();
  }, [friendId, _id, token]);

  const sendFriendRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/users/${_id}/friend-request/${friendId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        setFriendStatus("pending");
        // Update user state to include sent request
        const updatedUser = {
          ...user,
          friendRequestsSent: [...(user.friendRequestsSent || []), friendId]
        };
        dispatch(setUser({ user: updatedUser }));

      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/users/${_id}/remove-friend/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setFriendStatus("none");
        // Update friends list using setFriends for consistency
        dispatch(setFriends({ friends: data.friends }));
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show button for own profile
  if (isOwnProfile) {
    return null;
  }

  return (
    <Button
      onClick={friendStatus === "friends" ? removeFriend : sendFriendRequest}
      variant={friendStatus === "friends" ? "outlined" : "contained"}
      size="small"
      disabled={loading || friendStatus === "pending"}
      startIcon={
        friendStatus === "pending" ? <Schedule sx={{ fontSize: "1rem" }} /> : 
        friendStatus === "friends" ? <PersonRemoveOutlined sx={{ fontSize: "1rem" }} /> : 
        <PersonAddOutlined sx={{ fontSize: "1rem" }} />
      }
      sx={{
        borderRadius: "20px",
        px: "1.5rem",
        py: "0.375rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        textTransform: "none",
        minWidth: "120px",
        height: "36px",
        ...(friendStatus === "friends" ? {
          borderColor: palette.neutral.medium,
          color: "text.primary",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "#F4212E08",
            borderColor: "#F4212E",
            color: "#F4212E",
          },
        } : friendStatus === "pending" ? {
          backgroundColor: palette.neutral.light,
          color: "text.secondary",
          borderColor: palette.neutral.medium,
          "&:hover": {
            backgroundColor: palette.neutral.light,
          },
        } : {
          backgroundColor: palette.primary.main,
          color: "white",
          border: "none",
          "&:hover": {
            backgroundColor: palette.primary.dark,
          },
        }),
      }}
    >
      {loading ? "Loading..." : 
       friendStatus === "friends" ? "Unfriend" :
       friendStatus === "pending" ? "Request Sent" : 
       "Add Friend"}
    </Button>
  );
};

export default FriendButton;