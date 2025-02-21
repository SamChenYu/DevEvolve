import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import Sidebar from "../layout/Sidebar";
import { getUserFromToken } from "../../services/AuthenicationService";
import { UserContext } from "../../context/UserContext";


const DeveloperDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("User in developer dashboard:", user);

  useEffect(() => {
    if (!user || user.role !== "DEVELOPER") {
      navigate("/login");
    }
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