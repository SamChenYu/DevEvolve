import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import { UserContext } from "../../context/UserContext";


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
      </Box>
    </Box>
  );
};

export default DeveloperDashboard;