import React, { useState, useEffect, use } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from '../layout/Sidebar';
import ProjectList from '../projects/ProjectList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { getUserFromToken } from '/Users/vishvamehta/Documents/swe_group16_project copy 2/src/services/AuthenicationService.jsx';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedRole = location.state?.user.role;
  const [user, setUser] = useState(null);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await getUserFromToken();
        console.log('User:', response);
        if (!response || storedRole !== "CLIENT") {
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
        {user?.id && <ProjectList clientId={user?.id} />}
        {user?.coins !== null && (
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
              {user?.coins} Coins
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ClientDashboard