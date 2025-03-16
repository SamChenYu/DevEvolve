import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import { UserContext } from "../../context/UserContext";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchProjectsByDeveloper } from "../../services/ProjectService";
import BrowseProjectItem from "../browse/BrowseProjectItem";

const DeveloperDashboard = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState({ inProgress: [], completed: [] });

  useEffect(() => {
    if (!loading && (!user || user.role !== "DEVELOPER")) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  useEffect(() => {
    if (user?.user?.id) {
      fetchProjectsByDeveloper(user.user.id)
        .then((data) => {
          const inProgress = data.filter((p) => p.status === "IN_PROGRESS");
          const completed = data.filter((p) => p.status === "COMPLETED");
          setProjects({ inProgress, completed });
        })
        .catch((err) => console.error("Error fetching developer projects:", err));
    }
  }, [user]);

  if (loading) {
    return <Typography variant="h4">Loading...</Typography>;
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true, // Add centerMode for better spacing
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Welcome Back {user.user?.firstName}!</Typography>
        
        {user.user?.coins !== null && (
          <Box sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#2c2c2c',
            borderRadius: 2,
            p: 2
          }}>
            <MonetizationOnIcon sx={{ color: '#FFD700', mr: 1 }} />
            <Typography variant="body1" sx={{ color: 'white' }}>
              {user.user?.coins} Coins
            </Typography>
          </Box>
        )}

        <Typography variant="h5" sx={{ mt: 3 }}>In Progress Projects</Typography>
        {projects.inProgress.length > 0 ? (
          <Slider {...settings}>
            {projects.inProgress.map((project) => (
              <Box 
                key={project.id} 
                sx={{ p: 2, display: 'flex', justifyContent: 'center' }} 
                onClick={() => navigate(`/project-details/${project.id}`)}
              >
                <BrowseProjectItem project={project} />
              </Box>
            ))}
          </Slider>
        ) : (
          <>
            <Typography>No in-progress projects.</Typography>
            <Typography sx={{ color: '#00bcd4', cursor: 'pointer', mt: 1 }} onClick={() => navigate("/browse-projects")}>Look for some here.</Typography>
          </>
        )}

        <Typography variant="h5" sx={{ mt: 3 }}>Completed Projects</Typography>
        {projects.completed.length > 0 ? (
          <Slider {...settings}>
            {projects.completed.map((project) => (
              <Box 
                key={project.id} 
                sx={{ p: 2, display: 'flex', justifyContent: 'center' }} 
                onClick={() => navigate(`/project-details/${project.id}`)}
              >
                <BrowseProjectItem project={project} />
              </Box>
            ))}
          </Slider>
        ) : (
          <Typography>No completed projects.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default DeveloperDashboard;
