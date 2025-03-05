import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { browseProjectDetails } from '../../services/ProjectService';
import Sidebar from '../layout/Sidebar';
import { Box, Card, CardContent, Typography, IconButton, CardMedia, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BrowseProjectItemDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    browseProjectDetails(projectId)
      .then(setProject)
      .catch((error) => console.error('Error fetching project details:', error));
  }, [projectId]);

  if (!project) {
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
        <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', right: 20, top: 20, color: '#9C27B0' }}>
          <ArrowBackIcon />
        </IconButton>
        <Card sx={{ backgroundColor: '#1E1E1E', color: 'white', p: 3 }}>
          <CardMedia
            component="img"
            height="250"
            image="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=170667a&w=0&k=20&c=Q7gLG-xfScdlTlPGFohllqpNqpxsU1jy8feD_fob87U="
            alt="Project Image"
          />
          <CardContent>
            <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>{project.title}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>{project.description}</Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}><strong>Posted At:</strong> {project.postedAt}</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}><strong>Amount of Bids:</strong> {project.bids.length > 0 ? project.bids.length : 0}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default BrowseProjectItemDetails;
