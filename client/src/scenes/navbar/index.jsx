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
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const iconStyle = { fontSize: "25px", cursor: "pointer", transition: "0.3s" };
  const selectStyle = {
    backgroundColor: neutralLight,
    width: "150px",
    borderRadius: "0.5rem",
    p: "0.5rem 1rem",
    "& .MuiSvgIcon-root": { pr: "0.25rem", width: "3rem" },
    "& .MuiSelect-select:focus": { backgroundColor: neutralLight },
    "&:hover": { backgroundColor: primaryLight },
  };

  return (
    <FlexBetween
      padding="1rem 6%"
      backgroundColor={alt}
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
    >
      {/* LEFT SIDE */}
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color={theme.palette.mode === "dark" ? "white" : "black"} // dynamic base color
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: theme.palette.mode === "dark" ? "#ddd" : "#1976d2", // dark mode: light gray, light mode: blue
              cursor: "pointer",
              transition: "color 0.3s",
            },
          }}
        >
          Connect
        </Typography>

        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="12px"
            gap="1rem"
            padding="0.25rem 1rem"
            sx={{ "&:hover": { backgroundColor: primaryLight } }}
          >
            <InputBase placeholder="Search..." sx={{ width: "200px" }} />
            <IconButton>
              <Search sx={{ color: dark }} />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* RIGHT SIDE */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={iconStyle} />
            ) : (
              <LightMode sx={{ ...iconStyle, color: dark }} />
            )}
          </IconButton>
          <Message sx={iconStyle} />
          <Notifications sx={iconStyle} />
          <Help sx={iconStyle} />
          <FormControl variant="standard" value={fullName}>
            <Select value={fullName} sx={selectStyle} input={<InputBase />}>
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE MENU */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
          boxShadow="-2px 0 8px rgba(0,0,0,0.2)"
          p="1rem"
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setIsMobileMenuToggled(false)}>
              <Close />
            </IconButton>
          </Box>

          <FlexBetween
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
          >
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={iconStyle} />
              ) : (
                <LightMode sx={{ ...iconStyle, color: dark }} />
              )}
            </IconButton>
            <Message sx={iconStyle} />
            <Notifications sx={iconStyle} />
            <Help sx={iconStyle} />
            <FormControl variant="standard" value={fullName}>
              <Select value={fullName} sx={selectStyle} input={<InputBase />}>
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
