import { useState, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Navbar from "../layout/Navbar";
import WidgetWrapper from "../components/ui/WidgetWrapper";
import UserCard from "../components/ui/UserCard";

const FindFriendsPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      // Filter out current user
      const otherUsers = data.filter(user => user._id !== currentUser._id);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Check if there's a search parameter from the navbar
    const searchFromUrl = searchParams.get('search');
    console.log('Search from URL:', searchFromUrl);
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
      console.log('Set search term to:', searchFromUrl);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  return (
    <Box minHeight="100vh" backgroundColor="background.default">
      <Navbar />
      <Box
        maxWidth="800px"
        margin="0 auto"
        padding={isNonMobileScreens ? "2rem" : "1rem"}
      >
        {/* Header */}
        <Box mb="2rem">
          <Typography
            variant="h3"
            fontWeight="700"
            color="text.primary"
            mb="0.5rem"
          >
            Find Friends
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            Connect with people and see their posts in your feed
          </Typography>
        </Box>

        {/* Search Bar */}
        <WidgetWrapper sx={{ mb: "2rem" }}>
          <TextField
            fullWidth
            placeholder="Search by name, occupation, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
              },
            }}
          />
        </WidgetWrapper>

        {/* Users List */}
        {loading ? (
          <WidgetWrapper>
            <Typography textAlign="center" color="text.secondary">
              Loading users...
            </Typography>
          </WidgetWrapper>
        ) : filteredUsers.length === 0 ? (
          <WidgetWrapper>
            <Typography textAlign="center" color="text.secondary">
              {searchTerm ? "No users found matching your search." : "No other users found."}
            </Typography>
          </WidgetWrapper>
        ) : (
          <Box display="grid" gap="1rem">
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                userId={user._id}
                firstName={user.firstName}
                lastName={user.lastName}
                occupation={user.occupation}
                location={user.location}
                picturePath={user.picturePath}
                bio={user.bio}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FindFriendsPage;