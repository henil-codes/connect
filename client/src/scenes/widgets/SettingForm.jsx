import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Avatar,
  Paper,
  useMediaQuery,
} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useNavigate, useParams } from "react-router-dom";

const SettingForm = () => {
  const { userId } = useParams();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Handle image upload (frontend only)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  // Handle save button
  const handleSave = (e) => {
    e.preventDefault();
    alert("✅ Your profile is updated successfully!");
    navigate(`/profile/${userId}`);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: palette.background.alt,
        padding: "2rem 1rem",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "1.5rem",
          padding: "2rem",
          backgroundColor: palette.background.default,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <WidgetWrapper>
          <Typography
            variant="h4"
            fontWeight="500"
            color={palette.neutral.dark}
            textAlign="center"
            mb="2rem"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2rem" },
            }}
          >
            Update Profile
          </Typography>

          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap="2rem"
            onSubmit={handleSave}
          >
            {/* Profile Picture Section */}
            <Box textAlign="center">
              <Avatar
                src={profilePic}
                alt="Profile"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  margin: "0 auto 1.5rem",
                  border: `4px solid ${palette.primary.light}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
              <Button 
                variant="outlined" 
                component="label"
                sx={{
                  borderColor: palette.primary.main,
                  color: palette.primary.main,
                  borderRadius: "2rem",
                  padding: "0.5rem 1.5rem",
                  fontWeight: "600",
                  "&:hover": {
                    backgroundColor: palette.primary.light,
                    borderColor: palette.primary.dark,
                  },
                }}
              >
                Change Picture
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>

            {/* Form Fields */}
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  "&:hover fieldset": {
                    borderColor: palette.primary.light,
                  },
                },
              }}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  "&:hover fieldset": {
                    borderColor: palette.primary.light,
                  },
                },
              }}
            />
            <TextField
              label="Bio"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  "&:hover fieldset": {
                    borderColor: palette.primary.light,
                  },
                },
              }}
            />

            {/* Save Button */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #1b86ebff, #0a5adaff)",
                color: "white",
                borderRadius: "2rem",
                padding: "0.75rem 2rem",
                fontWeight: "600",
                fontSize: "1rem",
                textTransform: "none",
                marginTop: "1rem",
                "&:hover": {
                  background: "linear-gradient(90deg, #0a5adaff, #1b86ebff)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Save Changes
            </Button>
          </Box>
        </WidgetWrapper>
      </Paper>
    </Box>
  );
};

export default SettingForm;