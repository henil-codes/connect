import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/ui/Friend";
import WidgetWrapper from "../../components/ui/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends) || [];
  const currentUser = useSelector((state) => state.user);
  
  // Check if this is the current user's friend list
  const isOwnFriendList = currentUser._id === userId;

  const getFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!response.ok) {
        console.error("Failed to fetch friends:", response.status);
        dispatch(setFriends({ friends: [] }));
        return;
      }
      
      const data = await response.json();
      dispatch(setFriends({ friends: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error("Error fetching friends:", error);
      dispatch(setFriends({ friends: [] }));
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              showUnfriend={isOwnFriendList}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No friends yet
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;