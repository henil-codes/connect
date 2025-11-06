import { useState } from "react";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { AutoAwesome, TrendingUp, People } from "@mui/icons-material";

const FeedTabs = ({ onFeedChange, currentFeed = "personalized" }) => {
  const [value, setValue] = useState(currentFeed);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onFeedChange(newValue);
  };

  return (
    <Box
      sx={{
        mb: "1rem",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "16px",
        border: `1px solid ${theme.palette.neutral.light}`,
        overflow: "hidden",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            minHeight: "48px",
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              color: theme.palette.primary.main,
            },
            "&:hover": {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.main + "08",
            },
          },
        }}
      >
        <Tab
          value="personalized"
          label="For You"
          icon={<AutoAwesome sx={{ fontSize: "1rem" }} />}
          iconPosition="start"
        />
        <Tab
          value="following"
          label="Following"
          icon={<People sx={{ fontSize: "1rem" }} />}
          iconPosition="start"
        />
        <Tab
          value="trending"
          label="Trending"
          icon={<TrendingUp sx={{ fontSize: "1rem" }} />}
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );
};

export default FeedTabs;