import { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "../layout/Navbar";
import ConversationsList from "../features/messages/ConversationsList";
import ChatWindow from "../features/messages/ChatWindow";

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state.user);
  const location = useLocation();

  // Check if navigated from profile with friend info
  useEffect(() => {
    if (location.state) {
      const { partnerId, partnerName, partnerPicture } = location.state;
      if (partnerId) {
        setSelectedConversation({
          partnerId,
          partnerName,
          partnerPicture,
          lastMessage: "",
          lastMessageTime: new Date(),
          unreadCount: 0,
        });
      }
    }
  }, [location.state]);

  return (
    <Box minHeight="100vh" backgroundColor="background.default">
      <Navbar />
      <Box
        maxWidth="1200px"
        margin="0 auto"
        padding={isNonMobileScreens ? "1rem 2rem" : "0"}
        height="calc(100vh - 80px)"
      >
        <Box
          display="flex"
          height="100%"
          border="1px solid"
          borderColor="neutral.light"
          borderRadius={isNonMobileScreens ? "12px" : "0"}
          overflow="hidden"
          backgroundColor="background.paper"
        >
          {/* Conversations List */}
          {(isNonMobileScreens || !selectedConversation) && (
            <Box
              width={isNonMobileScreens ? "350px" : "100%"}
              borderRight={isNonMobileScreens ? "1px solid" : "none"}
              borderColor="neutral.light"
            >
              <ConversationsList
                userId={user._id}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
              />
            </Box>
          )}

          {/* Chat Window */}
          {(isNonMobileScreens || selectedConversation) && (
            <Box flex={1}>
              <ChatWindow
                userId={user._id}
                conversation={selectedConversation}
                onBack={() => setSelectedConversation(null)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MessagesPage;
