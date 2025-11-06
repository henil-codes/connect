import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1rem",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: theme.palette.mode === "dark" 
    ? `1px solid ${theme.palette.neutral.light}` 
    : `1px solid ${theme.palette.neutral.light}`,
  boxShadow: theme.palette.mode === "dark" 
    ? "none" 
    : "0 1px 3px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" 
      ? theme.palette.neutral.light + "08" 
      : theme.palette.background.alt,
  },
}));

export default WidgetWrapper;