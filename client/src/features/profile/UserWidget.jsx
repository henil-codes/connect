import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "../../components/ui/UserImage";
import FlexBetween from "../../components/ui/FlexBetween";
import WidgetWrapper from "../../components/ui/WidgetWrapper";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import FriendButton from "../../components/ui/FriendButton";
import MessageButton from "../../components/ui/MessageButton";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  
  // Check if this is the logged-in user's own profile
  const isOwnProfile = loggedInUser._id === userId;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    bio,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <>
      <WidgetWrapper>
        {/* Profile Header */}
        <Box mb="1rem">
          <Box
            display="flex"
            alignItems="flex-start"
            gap="1rem"
            mb="0.75rem"
          >
            <Box
              onClick={() => navigate(`/profile/${userId}`)}
              sx={{ cursor: "pointer" }}
            >
              <UserImage image={picturePath} size="48px" />
            </Box>
            <Box flex={1}>
              <Box
                onClick={() => navigate(`/profile/${userId}`)}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  variant="h6"
                  color="text.primary"
                  fontWeight="700"
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    fontSize: "1.125rem",
                    mb: "0.25rem",
                  }}
                >
                  {firstName} {lastName}
                </Typography>
                <Typography 
                  color="text.secondary" 
                  variant="body2"
                  sx={{ fontSize: "0.875rem", mb: "0.75rem" }}
                >
                  {friends.length} following
                </Typography>
              </Box>
              
              {/* Friend & Message Buttons - Only show for other users' profiles */}
              {!isOwnProfile && (
                <Box display="flex" gap="0.5rem">
                  <FriendButton friendId={userId} />
                  <MessageButton 
                    friendId={userId}
                    friendName={`${user.firstName} ${user.lastName}`}
                    friendPicture={user.picturePath}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Bio */}
        {bio && (
          <Box mb="1rem">
            <Typography 
              color="text.primary" 
              variant="body2"
              sx={{ 
                fontSize: "0.9375rem",
                lineHeight: 1.4,
              }}
            >
              {bio}
            </Typography>
          </Box>
        )}

        {/* Location & Occupation */}
        {(location || occupation) && (
          <Box mb="1rem">
            {location && (
              <Box display="flex" alignItems="center" gap="0.5rem" mb="0.5rem">
                <LocationOnOutlined sx={{ color: "text.secondary", fontSize: "1rem" }} />
                <Typography color="text.secondary" variant="body2">
                  {location}
                </Typography>
              </Box>
            )}
            {occupation && (
              <Box display="flex" alignItems="center" gap="0.5rem">
                <WorkOutlineOutlined sx={{ color: "text.secondary", fontSize: "1rem" }} />
                <Typography color="text.secondary" variant="body2">
                  {occupation}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Stats */}
        <Box mb="1rem">
          <FlexBetween mb="0.5rem">
            <Typography color="text.secondary" variant="body2">
              Profile views
            </Typography>
            <Typography color="primary.main" fontWeight="600" variant="body2">
              {viewedProfile}
            </Typography>
          </FlexBetween>
          <FlexBetween>
            <Typography color="text.secondary" variant="body2">
              Post impressions
            </Typography>
            <Typography color="primary.main" fontWeight="600" variant="body2">
              {impressions}
            </Typography>
          </FlexBetween>
        </Box>

        {/* Quick Actions - Only show for own profile */}
        {isOwnProfile && (
          <Box 
            display="flex" 
            flexDirection="column"
            gap="0.5rem"
            pt="0.75rem"
            borderTop={`1px solid ${palette.neutral.light}`}
          >
            <Button
              size="small"
              variant="text"
              startIcon={<EditOutlined />}
              onClick={() => setEditModalOpen(true)}
              sx={{
                color: "text.secondary",
                fontSize: "0.8125rem",
                textTransform: "none",
                justifyContent: "flex-start",
                "&:hover": { color: "primary.main" },
              }}
            >
              Edit Profile
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<LockOutlined />}
              onClick={() => setChangePasswordModalOpen(true)}
              sx={{
                color: "text.secondary",
                fontSize: "0.8125rem",
                textTransform: "none",
                justifyContent: "flex-start",
                "&:hover": { color: "primary.main" },
              }}
            >
              Change Password
            </Button>
          </Box>
        )}
      </WidgetWrapper>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          // Refresh user data after edit
          getUser();
        }}
        user={user}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </>
  );
};

export default UserWidget;