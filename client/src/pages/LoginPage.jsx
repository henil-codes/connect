import { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";

const LoginPage = () => {
  const [pageType, setPageType] = useState("login");
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isLogin = pageType === "login";

  return (
    <Box
      minHeight="100vh"
      display="flex"
      backgroundColor={theme.palette.background.default}
    >
      {/* Left Side - Branding */}
      {isNonMobileScreens && (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor={theme.palette.primary.main}
          color="white"
          p="4rem"
        >
          <Typography
            fontWeight="800"
            fontSize="4rem"
            mb="2rem"
            sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            Connect
          </Typography>
          <Typography
            variant="h4"
            fontWeight="600"
            textAlign="center"
            mb="1rem"
          >
            Happening now
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ opacity: 0.9, maxWidth: "400px" }}
          >
            Join the conversation and connect with people around the world
          </Typography>
        </Box>
      )}

      {/* Right Side - Form */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p="2rem"
        backgroundColor={theme.palette.background.paper}
      >
        {/* Mobile Logo */}
        {!isNonMobileScreens && (
          <Box textAlign="center" mb="3rem">
            <Typography
              fontWeight="800"
              fontSize="2.5rem"
              color="primary"
              mb="1rem"
            >
              Connect
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join the conversation
            </Typography>
          </Box>
        )}

        {/* Form Container */}
        <Box
          width="100%"
          maxWidth="400px"
          p={isNonMobileScreens ? "2rem" : "1rem"}
          borderRadius="16px"
          backgroundColor={theme.palette.background.paper}
          border={`1px solid ${theme.palette.neutral.light}`}
          boxShadow={theme.palette.mode === "light" ? "0 8px 32px rgba(0,0,0,0.1)" : "none"}
        >
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="2rem"
            color="text.primary"
          >
            {isLogin ? "Sign in to Connect" : "Join Connect today"}
          </Typography>

          {/* Render Login or Register Form */}
          {isLogin ? <LoginForm /> : <RegisterForm />}

          {/* Toggle between Login and Register */}
          <Box textAlign="center" mt="2rem">
            <Typography variant="body2" color="text.secondary" mb="0.5rem">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Typography>
            <Typography
              onClick={() => setPageType(isLogin ? "register" : "login")}
              sx={{
                color: theme.palette.primary.main,
                cursor: "pointer",
                fontWeight: "600",
                "&:hover": { 
                  textDecoration: "underline",
                  color: theme.palette.primary.dark,
                },
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Typography>


          </Box>
        </Box>
      </Box>


    </Box>
  );
};

export default LoginPage;