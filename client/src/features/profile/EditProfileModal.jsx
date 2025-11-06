import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../state";

const EditProfileModal = ({ open, onClose, user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    location: user?.location || "",
    occupation: user?.occupation || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const updatedUser = await response.json();

      if (response.ok) {
        // Update the user in Redux state
        dispatch(setUser({ user: updatedUser }));
        onClose();
      } else {
        setError(updatedUser.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundColor: theme.palette.background.paper,
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="700">
            Edit Profile
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Box display="flex" gap="1rem">
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Box>

            <TextField
              name="bio"
              label="Bio"
              value={formData.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Tell us about yourself..."
              inputProps={{ maxLength: 160 }}
              helperText={`${formData.bio.length}/160 characters`}
              variant="outlined"
            />

            <TextField
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              placeholder="Where are you based?"
              variant="outlined"
            />

            <TextField
              name="occupation"
              label="Occupation"
              value={formData.occupation}
              onChange={handleChange}
              fullWidth
              placeholder="What do you do?"
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: "1.5rem" }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ borderRadius: "20px", px: "2rem" }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            sx={{ 
              borderRadius: "20px", 
              px: "2rem",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileModal;