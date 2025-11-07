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
  Alert,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";

const ChangePasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    // Check for password strength
    const hasUpperCase = /[A-Z]/.test(formData.newPassword);
    const hasLowerCase = /[a-z]/.test(formData.newPassword);
    const hasNumbers = /\d/.test(formData.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("New password must contain at least one uppercase letter, one lowercase letter, and one number");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/password`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
            Change Password
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {error && (
              <Alert severity="error" sx={{ borderRadius: "12px" }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ borderRadius: "12px" }}>
                Password changed successfully!
              </Alert>
            )}

            <TextField
              name="currentPassword"
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility("current")}
                    edge="end"
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              name="newPassword"
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              helperText="Must be at least 6 characters with uppercase, lowercase, and number"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility("new")}
                    edge="end"
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              name="confirmPassword"
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility("confirm")}
                    edge="end"
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: "1.5rem" }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            sx={{ borderRadius: "20px", px: "2rem" }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading || success}
            sx={{ 
              borderRadius: "20px", 
              px: "2rem",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordModal;