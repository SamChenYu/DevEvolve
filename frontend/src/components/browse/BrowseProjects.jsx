import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BrowseProjectItem from './BrowseProjectItem';
import Sidebar from '../layout/Sidebar';
import { fetchAllProjects } from '../../services/ProjectService';
import { Box, Typography, Grid, useTheme} from '@mui/material';
import { UserContext } from '../../context/UserContext';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const {user, loading } = useContext(UserContext);
  const theme = useTheme();

  useEffect(() => {
    if (!loading && (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN"))) {
      //console.log("Not admin or developer");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchAllProjects()
      .then((data) => {
        const filteredProjects = data.filter(project => project.status === "FINDING_DEVELOPER");
        setProjects(filteredProjects);
      })
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  if (loading) {
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

  

  if (projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
        <Sidebar/>
        <Typography variant="h4" color="white" sx={{ fontWeight: 600 }}>
          No projects found :(
        </Typography>
      </Box>
    );
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
    <Box sx={{ display: 'flex', backgroundColor: '#121212', height: '100vh', color: 'white' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" color="white" sx={{ fontWeight: 600, mb: 3 }}>
          Browse Projects
        </Typography>
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id} onClick={() => navigateToProjectDetails(project)}>
              <BrowseProjectItem project={project} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BrowseProjects;
