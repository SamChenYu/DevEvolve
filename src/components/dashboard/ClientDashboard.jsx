import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from '../layout/Sidebar';
import ProjectList from '../projects/ProjectList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { UserContext } from '../../context/UserContext';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedRole = location.state?.userRole;

  const { user, loading } = useContext(UserContext);
  localStorage.setItem("user", JSON.stringify(user));
  console.log("User in client dashboard:", user);

  useEffect(() => {
    if (!loading && (!localStorage.getItem("user") || storedRole !== "CLIENT")) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  if (loading) {
    return <Typography variant="h4">Loading...</Typography>;
  }

  if (!user || storedRole !== "CLIENT") {
    return null; 
  }
  
  const menuItems = [
    { text: "Browse Developers", icon: <PersonSearchIcon />, onClick: () => navigate("/browse-developers") },
    { text: "Create Project", icon: <CreateIcon />, onClick: () => navigate("/create-project", {state: { storedRole: storedRole }} ) },
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