import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from '../layout/Sidebar';


const ClientDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "CLIENT") {
      navigate("/login");
    }
  }, [navigate]);
  
  const menuItems = [
    { text: "Browse Developers", icon: <PersonSearchIcon />, onClick: () => navigate("/browse-developers") },
    { text: "Create Project", icon: <CreateIcon />, onClick: () => navigate("/create-project") },
    { text: "Profile", icon: <AccountCircleIcon />, onClick: () => navigate("/profile") },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
      
      <Sidebar menuItems={menuItems} />


      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Welcome to the Client Dashboard</Typography>
      </Box>
    </Box>
  );
}

export default ClientDashboard