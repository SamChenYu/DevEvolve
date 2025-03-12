import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import { UserContext } from "../../context/UserContext";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";


const DeveloperDashboard = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("User in developer dashboard:", user);

  useEffect(() => {
    if (!loading && (!user || user.role !== "DEVELOPER")) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  if (loading) {
    return <Typography variant="h4">Loading...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
   
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Welcome to the Developer Dashboard</Typography>
        <Typography variant="h6">Developer: {user.user?.firstName} {user.user?.lastName}</Typography>
        {user.user?.coins !== null && (
          <Box sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#2c2c2c',
            borderRadius: 2,
            p: 2
          }}>
            <MonetizationOnIcon sx={{ color: '#FFD700', mr: 1 }} />
            <Typography variant="body1" sx={{ color: 'white' }}>
              {user.user?.coins} Coins
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DeveloperDashboard;