import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from '../layout/Sidebar';
import ProjectList from '../projects/ProjectList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import axios from 'axios';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const storedClientId = localStorage.getItem("userId");
  const [coins, setCoins] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    

    if (!token || role !== "CLIENT") {
      navigate("/login");
    }

    if (storedClientId) {
      axios
        .get(`http://localhost:8080/auth/users/${storedClientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const clientData = response.data;
          setCoins(clientData.coins); 
        })
        .catch((error) => {
          console.error('Error fetching client data:', error);
        });
    }
  }, [navigate, storedClientId]);
  
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
        {storedClientId && <ProjectList clientId={storedClientId} />}
        {coins !== null && (
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
              {coins} Coins
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ClientDashboard