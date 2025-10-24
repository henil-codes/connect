import { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterPage";

const LoginPage = () => {
  const [pageType, setPageType] = useState("login");
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

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
          color={theme.palette.mode === "dark" ? "white" : "black"}
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

      {/* Form Container */}
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
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </Typography>

        {/* Render Login or Register Form */}
        {isLogin ? <LoginForm /> : <RegisterForm />}

        {/* Toggle between Login and Register */}
        <Typography
          onClick={() => setPageType(isLogin ? "register" : "login")}
          sx={{
            textDecoration: "underline",
            color: "#1D9BF0",
            textAlign: "center",
            mt: "1rem",
            cursor: "pointer",
            fontWeight: "500",
            "&:hover": { color: "#1A8CD8" },
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up here."
            : "Already have an account? Login here."}
        </Typography>

        {/* Forgot Password Link - Only show on login */}
        {isLogin && (
          <Typography
            onClick={() => navigate("/forgotpass")}
            sx={{
              textDecoration: "underline",
              color: "#1D9BF0",
              textAlign: "center",
              mt: "0.5rem",
              cursor: "pointer",
              fontWeight: "500",
              "&:hover": { color: "#1A8CD8" },
            }}
          >
            Forgot Password?
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;