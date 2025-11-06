// color design tokens export - Twitter/X inspired
export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#FAFAFA",
    50: "#F7F9FA",
    100: "#EFF3F4",
    200: "#E1E8ED",
    300: "#AAB8C2",
    400: "#657786",
    500: "#536471",
    600: "#3C4043",
    700: "#202327",
    800: "#15181C",
    900: "#000000",
    1000: "#000000",
  },
  primary: {
    50: "#E8F5FE",
    100: "#B3E5FC",
    200: "#81D4FA",
    300: "#4FC3F7",
    400: "#29B6F6",
    500: "#1DA1F2", // Twitter blue
    600: "#1976D2",
    700: "#1565C0",
    800: "#0D47A1",
    900: "#0A2E5C",
  },
  accent: {
    pink: "#F91880",
    green: "#00BA7C",
    yellow: "#FFD400",
    red: "#F4212E",
    purple: "#794BC4",
  },
};

// mui theme settings - Twitter/X inspired
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode - Twitter dark theme
            primary: {
              dark: colorTokens.primary[300],
              main: colorTokens.primary[500],
              light: colorTokens.primary[200],
            },
            secondary: {
              main: colorTokens.accent.pink,
            },
            neutral: {
              dark: colorTokens.grey[0],
              main: colorTokens.grey[100],
              mediumMain: colorTokens.grey[200],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[600],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
              paper: colorTokens.grey[800],
            },
            text: {
              primary: colorTokens.grey[0],
              secondary: colorTokens.grey[300],
            },
          }
        : {
            // palette values for light mode - Twitter light theme
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[100],
            },
            secondary: {
              main: colorTokens.accent.pink,
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[100],
            },
            background: {
              default: colorTokens.grey[0],
              alt: colorTokens.grey[50],
              paper: colorTokens.grey[0],
            },
            text: {
              primary: colorTokens.grey[900],
              secondary: colorTokens.grey[500],
            },
          }),
    },
    typography: {
      fontFamily: ['"Inter"', '"Segoe UI"', 'Roboto', 'sans-serif'].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ['"Inter"', 'sans-serif'].join(","),
        fontSize: "2rem",
        fontWeight: 800,
      },
      h2: {
        fontFamily: ['"Inter"', 'sans-serif'].join(","),
        fontSize: "1.75rem",
        fontWeight: 700,
      },
      h3: {
        fontFamily: ['"Inter"', 'sans-serif'].join(","),
        fontSize: "1.5rem",
        fontWeight: 700,
      },
      h4: {
        fontFamily: ['"Inter"', 'sans-serif'].join(","),
        fontSize: "1.25rem",
        fontWeight: 600,
      },
      h5: {
        fontFamily: ['"Inter"', 'sans-serif'].join(","),
        fontSize: "1.125rem",
        fontWeight: 600,
      },
      h6: {
        fontFamily: ['"Inter"', 'sans-serif'].join(","),
        fontSize: "1rem",
        fontWeight: 600,
      },
      body1: {
        fontSize: "0.9375rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.4,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: mode === "dark" ? `1px solid ${colorTokens.grey[700]}` : `1px solid ${colorTokens.grey[200]}`,
          },
        },
      },
    },
  };
};
