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
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8080/auth/projects/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },

      })
      .then((res) => {
        setProjects(res.data);
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
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <Box sx={{ mt: 4, px: 3 }}>
      <Typography variant="h5" color="white" gutterBottom>
        Your Projects
      </Typography>
      {loading ? (
        <CircularProgress color="primary" />
      ) : projects.length > 0 ? (
        <Slider {...sliderSettings}>
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </Slider>
      ) : (
        <Typography color="gray">No projects found.</Typography>
      )}
    </Box>
  );
};

export default ProjectList;
