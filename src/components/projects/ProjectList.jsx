import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProjectItem from "./ProjectItem";
import axios from "axios";

const ProjectList = ({ clientId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/auth/projects/client/${clientId}`, { withCredentials: true })
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

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(3, projects.length), 
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: Math.min(2, projects.length) } },
      { breakpoint: 600, settings: { slidesToShow: Math.min(1, projects.length) } }
    ]
  };
  
  return (
    <Box sx={{ mt: 4, px: 3, overflow: "hidden", maxWidth: "85vw" }}>
      <Typography variant="h5" color="white" gutterBottom>
        Your Projects
      </Typography>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : projects.length > 0 ? (
        <Slider {...sliderSettings}>
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} clientId={clientId} sx={{cursor: 'pointer'}} />
          ))}
        </Slider>
      ) : (
        <Typography color="gray">No projects found.</Typography>
      )}
    </Box>
  );
};

export default ProjectList;
