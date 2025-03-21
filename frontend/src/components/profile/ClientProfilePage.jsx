import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { getDeveloperById as getUser } from '../../services/AuthenicationService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Avatar, Grid, Paper, IconButton, Divider, Chip, CssBaseline, CircularProgress } from '@mui/material'; 
import { ArrowBack, GitHub, LinkedIn, Twitter, Facebook, Edit } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import ProjectList from '../projects/ProjectList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { alpha } from '@mui/material/styles';

const ClientProfilePage = () => {
    const { user, loading } = useContext(UserContext);
    const { id } = useParams();
 
    const navigate = useNavigate();
    const [Client, setClient] = useState(null);
    const [userLoading, setLoading] = useState(true);
    const theme = useTheme();
  
    useEffect(() => {
      if (!loading && (!user || (user.role !== "CLIENT"))) {
        navigate("/login");
      }
    }, [navigate, user, loading]);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const data = await getUser(id);
            setClient(data);
          } catch (error) {
            console.error("Error fetching Client profile:", error);
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
          <Typography variant="h6">Client Profile</Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : Client ? (
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
                alt={Client.firstName ? `${Client.firstName} ${Client.lastName}` : "Client"}
              />
            </Box>
            
        
            <Box sx={{ textAlign: "center", mt: 2, px: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {Client.firstName ? `${Client.firstName} ${Client.lastName}` : "Client"}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ color: "#9c27b0", mb: 1 }}>
                {Client.role || "Full Stack Client"}
              </Typography>
              
              <Typography variant="body2" color="white">
                {Client.email || "email@example.com"}
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
     
              <Grid item xs={12} >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: "#222", 
                    p: 3, 
                    borderRadius: 2,
                    height: "100%",
                     border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DashboardIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                      Your Projects
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.secondary.main, 0.2) }} />
                
                  {user.user?.id && <ProjectList clientId={user.user?.id} />}
                </Paper>
              </Grid>
            </Grid>
          </>


        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Typography variant="h6"> Client not found.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ClientProfilePage;