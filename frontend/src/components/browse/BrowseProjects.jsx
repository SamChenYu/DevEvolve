import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BrowseProjectItem from './BrowseProjectItem';
import Sidebar from '../layout/Sidebar';
import { fetchAllProjects, searchProjects } from '../../services/ProjectService';
import { Box, Typography, Grid, TextField, InputAdornment, CircularProgress, CssBaseline, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { UserContext } from '../../context/UserContext';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(false);
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);
  const theme = useTheme();

  useEffect(() => {
    if (!userLoading && (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN"))) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  
  useEffect(() => {
    if (user) {
      getProjects();
    }
  }, [user]);

  const getProjects = async () => {
    setLoadingProjects(true);
    try {
      
      if (searchQuery.trim() === '') {
        const data = await fetchAllProjects();
        
        const filteredProjects = data.filter(project => project.status === "FINDING_DEVELOPER");
        setProjects(filteredProjects);
      } else {
        
        const data = await searchProjects(searchQuery);
        
        const filteredProjects = data.filter(project => project.status === "FINDING_DEVELOPER");
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoadingProjects(false);
  };

  
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      getProjects();
    } else {
      setLoadingProjects(true);
      try {
        const data = await searchProjects(query);
        const filteredProjects = data.filter(project => project.status === "FINDING_DEVELOPER");
        setProjects(filteredProjects);
      } catch (error) {
        console.error('Error searching projects:', error);
      }
      setLoadingProjects(false);
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
        <Typography variant="h4" sx={{ color: theme.palette.secondary.main }}>
          Loading...
        </Typography>
      </Box>
    );
  }
  
  if (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN")) {
    return null; 
  }
  
  const navigateToProjectDetails = (project) => {
    if (user.role === "DEVELOPER") {
      navigate(`/project-details/${project.projectId}`);
    }
    else if (user.role === "ADMIN") {
      navigate(`/projects/${project.clientId}/${project.projectId}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" color="white" sx={{ fontWeight: 600, mb: 3 }}>
          Browse Projects
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loadingProjects ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          projects.length > 0 ? (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id} onClick={() => navigateToProjectDetails(project)}>
                  <BrowseProjectItem project={project} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', mt: 5 }}>
              No projects found :(
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default BrowseProjects;
