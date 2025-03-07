import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Typography, Avatar, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from '../layout/Sidebar';
import { getDeveloperById } from '../../services/AuthenicationService';
import { useNavigate, useParams } from 'react-router-dom';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';

const DevProfile = () => {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const data = await getDeveloperById(id);
        setDeveloper(data);
      } catch (error) {
        console.error("Error fetching developer profile:", error);
      }
      setLoading(false);
    };

    fetchDeveloper();
  }, [id]);

  
  

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
      <Sidebar />

      
      <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign: "center", position: "relative" }}>
        
        
        <IconButton onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, color: "white" }}>
          <ArrowBackIcon />
        </IconButton>

        {loading ? (
          <CircularProgress color="secondary" sx={{ mt: 5 }} />
        ) : developer ? (
          <>
            
            <Avatar 
              sx={{ width: 120, height: 120, margin: "auto", bgcolor: "gray" }} 
              src="/placeholder-profile.png" 
              alt={`${developer.firstName} ${developer.lastName}`} 
            />

            
            <Typography variant="h4" sx={{ mt: 2 }}>{developer.firstName} {developer.lastName}</Typography>
            <Typography variant="subtitle1" sx={{ color: "gray" }}>{developer.email}</Typography>

            
            <Typography variant="body1" sx={{ mt: 2, mx: "auto", maxWidth: 500 }}>
              {developer.bio || "This developer has not added a bio yet."}
            </Typography>

            
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton sx={{ color: "white" }}><Facebook /></IconButton>
              <IconButton sx={{ color: "white" }}><Twitter /></IconButton>
              <IconButton sx={{ color: "white" }}><LinkedIn /></IconButton>
              <IconButton sx={{ color: "white" }}><GitHub /></IconButton>
            </Box>
          </>
        ) : (
          <Typography variant="h6">Developer not found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default DevProfile;