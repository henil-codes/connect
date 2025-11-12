import { IconButton, useTheme } from "@mui/material";
import { Message } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MessageButton = ({ friendId, friendName, friendPicture }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);

  const handleMessage = () => {
    // Navigate to messages page with this friend selected
    navigate("/messages", {
      state: {
        partnerId: friendId,
        partnerName: friendName,
        partnerPicture: friendPicture,
      },
    });
  };

  // Don't show button for own profile
  if (_id === friendId) {
    return null;
  }

  return (
    <IconButton
      onClick={handleMessage}
      sx={{
        backgroundColor: theme.palette.background.alt,
        border: `1px solid ${theme.palette.neutral.medium}`,
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: theme.palette.primary.main + "10",
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
        },
      }}
    >
      <Message sx={{ fontSize: "1.2rem" }} />
    </IconButton>
  );
};

export default MessageButton;
