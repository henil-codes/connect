import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Home,
  Person,
  MoreHoriz,
  Lock,
  Settings,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../components/ui/FlexBetween";
import ChangePasswordModal from "../features/profile/ChangePasswordModal";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryMain = theme.palette.primary.main;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleSearch = (e) => {
    console.log('Search triggered:', e?.key, searchTerm);
    if ((e?.key === 'Enter' || e?.type === 'click') && searchTerm.trim()) {
      console.log('Navigating to find-friends with search:', searchTerm);
      navigate(`/find-friends?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      console.log('Search icon clicked, navigating with:', searchTerm);
      navigate(`/find-friends?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      backgroundColor={theme.palette.background.paper}
      borderBottom={`1px solid ${theme.palette.neutral.light}`}
      sx={{ backdropFilter: "blur(12px)" }}
    >
      <FlexBetween padding="0.75rem 1rem" maxWidth="1200px" margin="0 auto">
        {/* LEFT SIDE */}
        <FlexBetween gap="2rem">
          <Typography
            fontWeight="800"
            fontSize="1.5rem"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            Connect
          </Typography>
          
          {isNonMobileScreens && (
            <Box
              display="flex"
              alignItems="center"
              backgroundColor={theme.palette.background.alt}
              borderRadius="25px"
              padding="0.5rem 1rem"
              minWidth="300px"
              border={`1px solid ${theme.palette.neutral.light}`}
            >
              <Search 
                sx={{ 
                  color: theme.palette.neutral.medium, 
                  mr: 1, 
                  cursor: 'pointer',
                  '&:hover': { color: theme.palette.primary.main }
                }} 
                onClick={handleSearchClick}
              />
              <InputBase 
                placeholder="Search for people..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                sx={{ 
                  width: "100%",
                  fontSize: "0.9rem",
                }}
              />
            </Box>
          )}
        </FlexBetween>

        {/* RIGHT SIDE */}
        {isNonMobileScreens ? (
          <FlexBetween gap="1rem">
            <IconButton
              onClick={() => navigate("/home")}
              sx={{
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: theme.palette.primary.main + "10" },
                borderRadius: "50%",
                p: "0.75rem",
              }}
            >
              <Home sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
            </IconButton>
            
            <Box position="relative">
              <IconButton
                sx={{
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: theme.palette.primary.main + "10" },
                  borderRadius: "50%",
                  p: "0.75rem",
                }}
              >
                <Notifications sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
              </IconButton>
              {/* Friend Request Badge */}
              {user.friendRequestsReceived && user.friendRequestsReceived.length > 0 && (
                <Box
                  position="absolute"
                  top="8px"
                  right="8px"
                  sx={{
                    backgroundColor: "#F91880",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  {user.friendRequestsReceived.length}
                </Box>
              )}
            </Box>
            
            <IconButton
              sx={{
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: theme.palette.primary.main + "10" },
                borderRadius: "50%",
                p: "0.75rem",
              }}
            >
              <Message sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
            </IconButton>

            <IconButton 
              onClick={() => dispatch(setMode())}
              sx={{
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: theme.palette.primary.main + "10" },
                borderRadius: "50%",
                p: "0.75rem",
              }}
            >
              {theme.palette.mode === "dark" ? (
                <LightMode sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
              ) : (
                <DarkMode sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
              )}
            </IconButton>

            {/* Profile Menu */}
            <Box
              display="flex"
              alignItems="center"
              gap="0.5rem"
              padding="0.5rem 1rem"
              borderRadius="25px"
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": { backgroundColor: theme.palette.background.alt },
              }}
            >
              <Avatar
                src={`http://localhost:3001/assets/${user.picturePath}`}
                sx={{ width: 32, height: 32 }}
              />
              <Box display="flex" flexDirection="column">
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  {fullName}
                </Typography>
              </Box>
              <FormControl variant="standard">
                <Select
                  value=""
                  displayEmpty
                  sx={{
                    "& .MuiSelect-select": { padding: 0 },
                    "& fieldset": { border: "none" },
                  }}
                  renderValue={() => <MoreHoriz />}
                >
                  <MenuItem onClick={() => navigate(`/profile/${user._id}`)}>
                    <Person sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => setChangePasswordModalOpen(true)}>
                    <Lock sx={{ mr: 1 }} /> Change Password
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Log Out
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            top="0"
            height="100vh"
            width="280px"
            zIndex="1001"
            backgroundColor={theme.palette.background.paper}
            borderLeft={`1px solid ${theme.palette.neutral.light}`}
            sx={{ backdropFilter: "blur(12px)" }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" p="1rem">
              <Typography variant="h6" fontWeight="700">Menu</Typography>
              <IconButton onClick={() => setIsMobileMenuToggled(false)}>
                <Close />
              </IconButton>
            </Box>
            
            <Box display="flex" flexDirection="column" gap="0.5rem" p="1rem">
              <Button
                startIcon={<Home />}
                onClick={() => { navigate("/home"); setIsMobileMenuToggled(false); }}
                sx={{ justifyContent: "flex-start", p: "0.75rem 1rem" }}
              >
                Home
              </Button>
              <Button
                startIcon={<Person />}
                onClick={() => { navigate(`/profile/${user._id}`); setIsMobileMenuToggled(false); }}
                sx={{ justifyContent: "flex-start", p: "0.75rem 1rem" }}
              >
                Profile
              </Button>
              <Button
                startIcon={<Notifications />}
                sx={{ justifyContent: "flex-start", p: "0.75rem 1rem" }}
              >
                Notifications
              </Button>
              <Button
                startIcon={<Message />}
                sx={{ justifyContent: "flex-start", p: "0.75rem 1rem" }}
              >
                Messages
              </Button>
              <Button
                startIcon={theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
                onClick={() => dispatch(setMode())}
                sx={{ justifyContent: "flex-start", p: "0.75rem 1rem" }}
              >
                {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button
                startIcon={<Lock />}
                onClick={() => { setChangePasswordModalOpen(true); setIsMobileMenuToggled(false); }}
                sx={{ justifyContent: "flex-start", p: "0.75rem 1rem" }}
              >
                Change Password
              </Button>
              <Button
                onClick={() => dispatch(setLogout())}
                sx={{ 
                  justifyContent: "flex-start", 
                  p: "0.75rem 1rem",
                  color: theme.palette.error?.main || "#f44336",
                  mt: "auto"
                }}
              >
                Log Out
              </Button>
            </Box>
          </Box>
        )}

        {/* Change Password Modal */}
        <ChangePasswordModal
          open={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
        />
      </FlexBetween>
    </Box>
  );
};

export default Navbar;