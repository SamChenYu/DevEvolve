import React, { useState, useEffect, useContext } from 'react';
import { Box, CssBaseline, Typography, TextField, InputAdornment, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress } from '@mui/material';
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

  const { user } = useContext(UserContext);
  localStorage.setItem("user", JSON.stringify(user));


  useEffect(() => {
    if (!localStorage.getItem("user") || !user) {
      navigate("/login");
    }
    fetchDevelopers();
  }, [user, navigate]);

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
                <ListItem key={dev.id} sx={{ borderBottom: "1px solid #444" }} onClick={() => navigate(`/developer/${dev.id}`)}>
                  <ListItemAvatar>
                    <Avatar>{dev.firstName.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${dev.firstName} ${dev.lastName}`} 
                    secondary={dev.email} 
                    sx={{ color: "white" }}
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
