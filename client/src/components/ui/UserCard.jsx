import { Box, Typography, useTheme } from "@mui/material";
import { LocationOn, Work } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "./WidgetWrapper";
import UserImage from "./UserImage";
import FriendButton from "./FriendButton";
import FlexBetween from "./FlexBetween";

const UserCard = ({ userId, firstName, lastName, occupation, location, picturePath, bio }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <WidgetWrapper>
      <FlexBetween>
        {/* User Info */}
        <FlexBetween gap="1rem" sx={{ flex: 1 }}>
          <UserImage image={picturePath} size="60px" />
          <Box sx={{ flex: 1, cursor: "pointer" }} onClick={handleProfileClick}>
            <Typography
              variant="h6"
              fontWeight="600"
              color="text.primary"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            
            {bio && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  mt: "0.25rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {bio}
              </Typography>
            )}
            
            <Box display="flex" alignItems="center" gap="1rem" mt="0.5rem">
              {occupation && (
                <Box display="flex" alignItems="center" gap="0.25rem">
                  <Work sx={{ fontSize: "1rem", color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {occupation}
                  </Typography>
                </Box>
              )}
              
              {location && (
                <Box display="flex" alignItems="center" gap="0.25rem">
                  <LocationOn sx={{ fontSize: "1rem", color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {location}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </FlexBetween>

        {/* Friend Button */}
        <Box ml="1rem">
          <FriendButton friendId={userId} />
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default UserCard;