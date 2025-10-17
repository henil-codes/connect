import { Box, Button, TextField, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    // Simulate sending a reset link (you can replace this with actual backend API)
    setMessage(`Password reset link sent to ${email}`);
    setEmail("");
  };

  return (

    
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor={theme.palette.background.default}
      p="1rem"
    >
      {/* Header / Logo */}
      <Box textAlign="center" mb="2rem">
        <Typography
          fontWeight="bold"
          fontSize={isNonMobileScreens ? "3rem" : "2.5rem"}
          color={theme.palette.mode === "dark" ? "white" : "black"} // dynamic color
          sx={{
            "&:hover": {
              color: theme.palette.mode === "dark" ? "#ddd" : "#1976d2",
              cursor: "pointer",
              transition: "color 0.3s",
            },
          }}
        >
          Connect
        </Typography>
        <Typography
          fontWeight="500"
          fontSize="1rem"
          color="textSecondary"
          sx={{ mt: "0.5rem" }}
        >
          The Social Hub to Connect with Everyone
        </Typography>
      </Box>

      {/* Forgot Password Card */}
      <Box
  width={isNonMobileScreens ? "40%" : "90%"}
  p="3rem"
  borderRadius="1.5rem"
  backgroundColor={theme.palette.background.alt}
  boxShadow="0 4px 20px rgba(0,0,0,0.1)"
>
  <Typography
    fontWeight="500"
    variant="h5"
    sx={{ mb: "2rem", textAlign: "center" }}
  >
    Reset Your Password
  </Typography>

  <form onSubmit={handleReset}>
    <TextField
      label="Email Address"
      type="email"
      fullWidth
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      sx={{ mb: "1.5rem" }}
    />

    {/* Updated Button Style */}
    <Button
      fullWidth
      type="submit"
      variant="contained"
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "0.75rem",
        borderRadius: "0.75rem",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#1D9BF0",
          color: "#fff",
        },
      }}
    >
      Send Reset Link
    </Button>
  </form>

  {message && (
    <Typography
      textAlign="center"
      color={message.includes("sent") ? "success.main" : "error.main"}
      sx={{ mt: "1rem" }}
    >
      {message}
    </Typography>
  )}

  {/* Back to Login aligned right */}
  <Typography
    textAlign="right"
    sx={{
      mt: "1.5rem",
      color: "#1D9BF0",
      cursor: "pointer",
      fontWeight: "500",
      "&:hover": { color: "#1A8CD8", textDecoration: "underline" },
    }}
    onClick={() => navigate("/")}
  >
    ← Back to Login
  </Typography>
</Box>


      
    </Box>
  );
};

export default ForgotPass;
