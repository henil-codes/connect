import { Box, Typography, IconButton } from "@mui/material";
import { PersonRemoveOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath, showUnfriend = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  const handleUnfriend = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking unfriend
    
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
        // Update friends list using setFriends for consistency
        dispatch(setFriends({ friends: data.friends }));
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <FlexBetween sx={{ py: "0.5rem" }}>
      <FlexBetween gap="0.75rem">
        <UserImage image={userPicturePath} size="40px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
          }}
          sx={{ cursor: "pointer", flex: 1 }}
        >
          <Typography
            color="text.primary"
            variant="body1"
            fontWeight="600"
            sx={{
              "&:hover": {
                textDecoration: "underline",
              },
              fontSize: "0.9375rem",
            }}
          >
            {name}
          </Typography>
          <Typography 
            color="text.secondary" 
            variant="body2"
            sx={{ fontSize: "0.875rem" }}
          >
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      
      {showUnfriend && (
        <IconButton
          onClick={handleUnfriend}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "#F4212E",
              backgroundColor: "#F4212E08",
            },
          }}
        >
          <PersonRemoveOutlined fontSize="small" />
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;