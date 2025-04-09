import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Divider } from '@mui/material';
import Slider from 'react-slick';
import ProjectItem from './ProjectItem'; 
import axios from 'axios';

const ProjectList = ({ clientId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/projects/client/${clientId}`, { withCredentials: true })
      .then((res) => {
        setProjects(res.data);
        console.log("Projects fetched:", res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, [clientId]);

  const archivedProjects = projects.filter(project => project.status === 'ARCHIVED');
  const nonArchivedProjects = projects.filter(project => project.status !== 'ARCHIVED');

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(2, nonArchivedProjects.length), 
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: Math.min(1, nonArchivedProjects.length) } },
      { breakpoint: 600, settings: { slidesToShow: Math.min(1, nonArchivedProjects.length) } }
    ]
  };

  return (
    <Box sx={{ mt: 4, px: 3, overflow: "hidden", maxWidth: "85vw" }}>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <>

          {nonArchivedProjects.length > 0 && (
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: "#222", mb: 3 }}>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                Your Active Projects
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Slider {...sliderSettings}>
                {nonArchivedProjects.map((project) => (
                  <ProjectItem key={project.id} project={project} clientId={clientId} />
                ))}
              </Slider>
            </Paper>
          )}

     
          {archivedProjects.length > 0 && (
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: "#222" }}>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                Your Archived Projects
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box>
                {archivedProjects.map((project) => (
                  <ProjectItem key={project.id} project={project} clientId={clientId} />
                ))}
              </Box>
            </Paper>
          )}

 
          {nonArchivedProjects.length === 0 && archivedProjects.length === 0 && (
            <Typography color="gray">No projects found.</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default ProjectList;
