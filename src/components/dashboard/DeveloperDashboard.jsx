import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import Sidebar from "../layout/Sidebar";
import { getUserFromToken } from "../../services/AuthenicationService";

const drawerWidth = 240;
const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedRole = location.state?.user.role;
  const [user, setUser] = useState(null);
  //const user = location.state?.user;
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await getUserFromToken();
        console.log("User:", response);
        if (!response || storedRole !== "DEVELOPER") {
          navigate("/login");
        } else {
          setUser(response);
        }
      } catch (error) {
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  const menuItems = [
    { text: "Browse Developers", icon: <PersonSearchIcon /> },
    { text: "Your Bids", icon: <PriceChangeIcon /> },
    { text: "Profile", icon: <AccountCircleIcon /> }
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
   
      <Sidebar menuItems={menuItems} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Welcome to the Developer Dashboard</Typography>
        <Typography variant="h6">Developer: {user?.firstName} {user?.lastName}</Typography>
      </Box>
    </Box>
  );
};

export default DeveloperDashboard;