import { Box, Typography, Chip, useTheme } from "@mui/material";
import { AutoAwesome, TrendingUp, People } from "@mui/icons-material";

const FeedIndicator = ({ feedType = "personalized" }) => {
  const theme = useTheme();

  const feedConfig = {
    personalized: {
      icon: <AutoAwesome sx={{ fontSize: "1rem" }} />,
      label: "For You",
      description: "Personalized based on your connections",
      color: theme.palette.primary.main,
    },
    trending: {
      icon: <TrendingUp sx={{ fontSize: "1rem" }} />,
      label: "Trending",
      description: "Popular posts right now",
      color: "#FF6B35",
    },
    following: {
      icon: <People sx={{ fontSize: "1rem" }} />,
      label: "Following",
      description: "Posts from people you follow",
      color: "#00BA7C",
    },
  };

  const config = feedConfig[feedType] || feedConfig.personalized;

  return (
    <Box
      sx={{
        mb: "1rem",
        p: "1rem",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "16px",
        border: `1px solid ${theme.palette.neutral.light}`,
      }}
    >
      <Box display="flex" alignItems="center" gap="0.75rem" mb="0.5rem">
        <Chip
          icon={config.icon}
          label={config.label}
          size="small"
          sx={{
            backgroundColor: config.color + "15",
            color: config.color,
            fontWeight: 600,
            "& .MuiChip-icon": {
              color: config.color,
            },
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.875rem" }}
        >
          {config.description}
        </Typography>
      </Box>
      
      {feedType === "personalized" && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.8125rem", fontStyle: "italic" }}
        >
          Posts are ranked by relevance, recency, and engagement from your network
        </Typography>
      )}
    </Box>
  );
};

export default FeedIndicator;