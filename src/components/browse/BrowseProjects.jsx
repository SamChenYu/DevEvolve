import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrowseProjectItem from './BrowseProjectItem';
import Sidebar from '../layout/Sidebar';
import { fetchAllProjects } from '../../services/ProjectService';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProjects()
      .then(setProjects)
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  if (projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', height: '100vh', color: 'white' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" color="secondary" sx={{ fontWeight: 600, mb: 3 }}>
          Browse Projects
        </Typography>
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id} onClick={() => navigate(`/project-details/${project.id}`)}>
              <BrowseProjectItem project={project} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BrowseProjects;
