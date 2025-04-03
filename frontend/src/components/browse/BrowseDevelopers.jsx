import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, CssBaseline, Typography, TextField, InputAdornment, 
  List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../layout/Sidebar';
import { getAllDevelopers, searchDevelopers } from '../../services/AuthenicationService';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const BrowseDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user, loading: userLoading } = useContext(UserContext);


  useEffect(() => {
    if (!userLoading && (!user || (user.role !== "CLIENT" && user.role !== "ADMIN"))) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);


  useEffect(() => {
    if (user && (user.role === "CLIENT" || user.role === "ADMIN")) {
      fetchDevelopers();
    }
  }, [user]);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const data = await getAllDevelopers();
      console.log("Developers:", data);
      setDevelopers(data);
    } catch (error) {
      console.error("Error fetching developers:", error);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchDevelopers();
      return;
    }

    try {
      const data = await searchDevelopers(query);
      setDevelopers(data);
    } catch (error) {
      console.error("Error searching developers:", error);
    }
  };

  
  if (userLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h4" sx={{ color: "white" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  
  if (!user || (user.role !== "CLIENT" && user.role !== "ADMIN")) {
    return null; 
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Browse Developers</Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search developers..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <List sx={{ bgcolor: "#1e1e1e", borderRadius: 2, p: 2 }}>
            {developers.length > 0 ? (
              developers.map((dev) => (
                <ListItem 
                  key={dev.id} 
                  sx={{ 
                    borderBottom: "1px solid #444", 
                    '&:hover': { border: "2px solid #9c27b0", borderRadius: "5px" } 
                  }} 
                  onClick={() => navigate(`/dev-profile/${dev.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 40, height: 40, mr: 3 }} src={dev.imageUrl}>
                      {dev.firstName.charAt(0)}{dev.lastName.charAt(0)}
                    </Avatar>

                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${dev.firstName} ${dev.lastName}`} 
                    secondary={dev.email} 
                    primaryTypographyProps={{ style: { color: "white" } }} 
                    secondaryTypographyProps={{ style: { color: "rgba(255,255,255,0.7)" } }} 
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No developers found.</Typography>
            )}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default BrowseDevelopers;
