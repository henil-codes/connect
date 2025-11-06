import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../layout/Navbar.jsx";
import UserWidget from "../features/profile/UserWidget.jsx";
import MyPostWidget from "../features/post/MyPostWidget.jsx";
import PostsWidget from "../features/post/PostsWidget.jsx";
import AdvertWidget from "../features/ads/AdvertWidget.jsx";
import FriendListWidget from "../features/profile/FriendListWidget.jsx";
import FriendRequestsWidget from "../features/profile/FriendRequestsWidget.jsx";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

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
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
        )}
        
        {/* Main Feed */}
        <Box
          flex={1}
          maxWidth={isNonMobileScreens ? "600px" : "100%"}
          mx="auto"
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        
        {/* Right Sidebar */}
        {isNonMobileScreens && (
          <Box width="280px" position="sticky" top="80px" height="fit-content">
            <FriendRequestsWidget />
            <Box mt="1rem">
              <AdvertWidget />
            </Box>
            <Box mt="1rem">
              <FriendListWidget userId={_id} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
