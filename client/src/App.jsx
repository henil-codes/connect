import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import FindFriendsPage from "./pages/FindFriendsPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./hooks/theme";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const token = useSelector((state) => state.token);
  const isAuth = Boolean(token);

  // Optional: Show loading until auth state is known
  if (token === undefined) return <div>Loading...</div>;

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SocketProvider>
            <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/find-friends"
              element={isAuth ? <FindFriendsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/messages"
              element={isAuth ? <MessagesPage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            </Routes>
          </SocketProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
