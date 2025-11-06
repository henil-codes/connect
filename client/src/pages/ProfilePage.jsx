import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../layout/Navbar.jsx";
import FriendListWidget from "../features/profile/FriendListWidget.jsx";
import MyPostWidget from "../features/post/MyPostWidget.jsx";
import PostsWidget from "../features/post/PostsWidget.jsx";
import UserWidget from "../features/profile/UserWidget.jsx";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  
  // Check if viewing own profile
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

  if (!user) return null;

  return (
    <Box minHeight="100vh" backgroundColor="background.default">
      <Navbar />
      <Box
        maxWidth="1200px"
        margin="0 auto"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        padding={isNonMobileScreens ? "1rem 2rem" : "1rem"}
      >
        {/* Left Sidebar */}
        {isNonMobileScreens && (
          <Box width="280px" position="sticky" top="80px" height="fit-content">
            <UserWidget userId={userId} picturePath={user.picturePath} />
          </Box>
        )}
        
        {/* Main Content */}
        <Box
          flex={1}
          maxWidth={isNonMobileScreens ? "600px" : "100%"}
          mx="auto"
        >
          {/* Only show compose widget on own profile */}
          {isOwnProfile && (
            <MyPostWidget picturePath={user.picturePath} />
          )}
          <PostsWidget userId={userId} isProfile />
        </Box>
        
        {/* Right Sidebar */}
        {isNonMobileScreens && (
          <Box width="280px" position="sticky" top="80px" height="fit-content">
            <FriendListWidget userId={userId} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;