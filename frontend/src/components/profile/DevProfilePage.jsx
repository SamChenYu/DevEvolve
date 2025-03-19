import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { getDeveloperById as getUser } from '../../services/AuthenicationService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import { useTheme } from '@mui/material/styles';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { Box, Typography, Avatar, Grid, Paper, IconButton, Divider, Chip, CssBaseline, CircularProgress, Button } from '@mui/material'; 
import { ArrowBack, GitHub, LinkedIn, Twitter, Facebook, Edit, Code, Star, Language, Verified } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const DevProfilePage = () => {
  const { user, loading } = useContext(UserContext);
  const { id } = useParams();
  //console.log(userId);
    const navigate = useNavigate();
    const [developer, setDeveloper] = useState(null);
    const [userLoading, setLoading] = useState(true);
    const theme = useTheme();
  
    useEffect(() => {
      if (!loading && (!user || (user.role !== "DEVELOPER" && user.role !== "CLIENT"))) {
        navigate("/login");
      }
    }, [navigate, user, loading]);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const data = await getUser(id);
            setDeveloper(data);
          } catch (error) {
            console.error("Error fetching developer profile:", error);
          }
          setLoading(false);
        };
    
        fetchUser();
      }, [user, loading]);
  
  
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

  
  const skills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'GraphQL', 'UI/UX'];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212", color: "white" }}>
      <CssBaseline />
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>

        <Box 
          sx={{ 
            p: 2, 
            display: "flex", 
            alignItems: "center", 
            position: "absolute", 
            top: 0, 
            left: 10, 
            width: "100%", 
            zIndex: 2
          }}
        >
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ color: "white", bgcolor: "rgba(0,0,0,0.3)", mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Developer Profile</Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : developer ? (
          <>
            
            <Box 
              sx={{ 
                height: "240px", 
                background: "linear-gradient(135deg, #9c27b0 0%, #4a148c 100%)",
                position: "relative",
              }}
            >
        
              <Chip
                icon={<Edit size="small"/>}
                label="Edit Profile"
                sx={{ 
                  position: "absolute", 
                  padding: 2,
                  right: 16, 
                  top: 64, 
                  bgcolor: "rgba(0,0,0,0.5)", 
                  color: "white", 
                  border: "1px solid rgba(255,255,255,0.2)" 
                }}
                onClick={() => navigate("/edit-profile")}
              />
            </Box>
            
       
            <Box sx={{ display: "flex", justifyContent: "center", mt: "-80px" }}>
              <Avatar 
                sx={{ 
                  width: 160, 
                  height: 160, 
                  border: "4px solid #121212",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                }} 
                src="/api/placeholder/400/400" 
                alt={developer.firstName ? `${developer.firstName} ${developer.lastName}` : "Developer"}
              />
            </Box>
            
        
            <Box sx={{ textAlign: "center", mt: 2, px: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {developer.firstName ? `${developer.firstName} ${developer.lastName}` : "Developer"}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ color: "#9c27b0", mb: 1 }}>
                {developer.role || "Full Stack Developer"}
              </Typography>
              
              <Typography variant="body2" color="white">
                {developer.email || "email@example.com"}
              </Typography>
              
          
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                <IconButton sx={{ color: "#1877F2", bgcolor: "rgba(255,255,255,0.05)" }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: "#1DA1F2", bgcolor: "rgba(255,255,255,0.05)" }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: "#0A66C2", bgcolor: "rgba(255,255,255,0.05)" }}>
                  <LinkedIn />
                </IconButton>
                <IconButton sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.05)" }}>
                  <GitHub />
                </IconButton>
              </Box>
            </Box>
            
            <Divider sx={{ mt: 3, mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />
            

            <Grid container spacing={3} sx={{ px: 3, pb: 5 }}>
     
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: "#1E1E1E", 
                    p: 3, 
                    borderRadius: 2,
                    height: "100%"
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" color="white">About</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#ccc", mb: 3, textAlign: "justify" }}>
                    {developer.bio || 
                      "Passionate developer with expertise in React, Node.js, and cloud technologies. Focused on creating clean, scalable solutions for complex problems. Always eager to learn new technologies and collaborate on innovative projects."}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "white", textAlign: "left" }}>Skills</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {skills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill}
                        icon={<Code />}
                        sx={{ 
                          bgcolor: "rgba(156, 39, 176, 0.1)", 
                          color: "#ce93d8",
                          '& .MuiChip-icon': { color: "#ce93d8" }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
           
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
          
                  <Grid item xs={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        p: 2, 
                        borderRadius: 2,
                        textAlign: "center"
                      }}
                    >
                      <Star sx={{ color: "#9c27b0", mb: 1, fontSize: 36 }} />
                      <Typography variant="h5" sx={{ fontWeight: 500, color: "white" }}>
                        {developer.projectCount || 12}
                      </Typography>
                      <Typography variant="body2" color="white">Projects</Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        p: 2, 
                        borderRadius: 2,
                        textAlign: "center"
                      }}
                    >
                      <Language sx={{ color: "#9c27b0", mb: 1, fontSize: 36 }} />
                      <Typography variant="h5" sx={{ fontWeight: 500, color: "white" }}>
                        {developer.experienceYears || 5}
                      </Typography>
                      <Typography variant="body2" color="white">Years Exp.</Typography>
                    </Paper>
                  </Grid>
                  
                  
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        p: 3, 
                        borderRadius: 2,
                        mt: 1
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, color: "white" }}> <ConnectWithoutContactIcon sx={{verticalAlign: "text-bottom", color: "#9c27b0"}} /> Contact</Typography>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ 
                          bgcolor: "#9c27b0", 
                          '&:hover': { bgcolor: "#7b1fa2" } 
                        }}
                      >
                        Message Developer
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{ 
                          mt: 2, 
                          borderColor: "rgba(156, 39, 176, 0.5)", 
                          color: "#9c27b0",
                          '&:hover': { borderColor: "#9c27b0" } 
                        }}
                      >
                        View Portfolio
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Typography variant="h6">Developer not found.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DevProfilePage;