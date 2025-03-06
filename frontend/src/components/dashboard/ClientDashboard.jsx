import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import ProjectList from '../projects/ProjectList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { UserContext } from '../../context/UserContext';



const ClientDashboard = () => {
  const navigate = useNavigate();

  const { user, loading } = useContext(UserContext);
  useEffect(() => {
    if (!loading && (!user || user.role !== "CLIENT")) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  if (loading) {
    return <Typography variant="h4">Loading...</Typography>;
  }

  if (!user || user.role !== "CLIENT") {
    return null; 
  }
  
  

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
      
      <Sidebar />


      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Welcome to the Client Dashboard</Typography>
        {user.user?.id && <ProjectList clientId={user.user?.id} />}
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
}

export default ClientDashboard