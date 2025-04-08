import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Typography, Paper, Container, Grid, Divider, Avatar, useTheme, alpha, Button, Chip } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import { UserContext } from "../../context/UserContext";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import TerminalIcon from '@mui/icons-material/Terminal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchProjectsByDeveloper } from "../../services/ProjectService";
import BrowseProjectItem from "../browse/BrowseProjectItem";
import { getUserFromToken } from "../../services/AuthenicationService";
import { useParams } from "react-router-dom";

const DeveloperDashboard = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const theme = useTheme();
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

  const [userBalance, setUserBalance] = useState(null); // Initialize user balance from context
  useEffect(() => {
    if (user) {
      setUserBalance(user.user.coins); // Update user balance from context
    }
  }, [user]);
  const { id } = useParams();
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const userData = await getUserFromToken();
        console.log("Coins fetched from token:", userData);
        setUserBalance(userData.user.coins); // Update user balance from context
      };
      fetchUser();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [id]);






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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212", color: "white" }}>
      <CssBaseline />
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 0, overflowX: "hidden" }}>

        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 0,
            backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
            py: 4,
            px: 4,
            mb: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'absolute', right: 30, bottom: -25, opacity: 0.2 }}>
            <DeveloperModeIcon sx={{ fontSize: 180, color: 'white' }} />
          </Box>
          
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  mb: 1, 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  Welcome Back, {user.user?.firstName}!
                </Typography>
                <Typography variant="subtitle1" sx={{ color: alpha('#fff', 0.8) }}>
                  Manage your ongoing projects and view your completed work all in one place
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Paper 
                  elevation={6}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: alpha('#fff', 0.15),
                    borderRadius: 3,
                    p: 2,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.secondary.light, 
                      width: 46, 
                      height: 46,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <MonetizationOnIcon sx={{ color: '#FFD700', fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="overline" sx={{ color: alpha('#fff', 0.7), display: 'block' }}>
                      Available Balance
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                      {userBalance} Coins
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Paper>

       
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
         
          <Paper 
            elevation={4}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: "#222",
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              mb: 4
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TerminalIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                  In Progress Projects
                </Typography>
                <Chip 
                  label={projects.inProgress.length} 
                  size="small" 
                  sx={{ 
                    ml: 2, 
                    bgcolor: theme.palette.secondary.main,
                    color: 'white'
                  }} 
                />
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<SearchIcon />}
                onClick={() => navigate("/browse-projects")}
                sx={{ 
                  color: theme.palette.secondary.main,
                  borderColor: theme.palette.secondary.main,
                  '&:hover': {
                    borderColor: theme.palette.secondary.dark,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1)
                  }
                }}
              >
                Browse Projects
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.secondary.main, 0.2) }} />
            
            {projects.inProgress.length > 0 ? (
              <Box sx={{ '& .slick-dots li button:before': { color: theme.palette.secondary.main } }}>
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
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.secondary.main, 0.15), borderRadius: 2 }}>
                <Typography variant="body1" sx={{ mb: 2, color:"white" }}>No in-progress projects at the moment.</Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: theme.palette.secondary.main,
                    '&:hover': { bgcolor: theme.palette.secondary.dark }
                  }}
                  startIcon={<SearchIcon />}
                  onClick={() => navigate("/browse-projects")}
                >
                  Find New Projects
                </Button>
              </Box>
            )}
          </Paper>

          
          <Paper 
            elevation={4}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: "#222",
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                Completed Projects
              </Typography>
              <Chip 
                label={projects.completed.length} 
                size="small" 
                sx={{ 
                  ml: 2, 
                  bgcolor: theme.palette.secondary.main,
                  color: 'white'
                }} 
              />
            </Box>
            
            <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.secondary.main, 0.2) }} />
            
            {projects.completed.length > 0 ? (
              <Box sx={{ '& .slick-dots li button:before': { color: theme.palette.secondary.main } }}>
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
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                <Typography variant="body1" color="white">You haven't completed any projects yet.</Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default DeveloperDashboard;