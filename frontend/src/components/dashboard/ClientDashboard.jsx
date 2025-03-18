import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  Divider, 
  Avatar, 
  useTheme, 
  alpha 
} from '@mui/material';
import Sidebar from '../layout/Sidebar';
import ProjectList from '../projects/ProjectList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WelcomeImage from '@mui/icons-material/EmojiPeople';
import { UserContext } from '../../context/UserContext';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, loading } = useContext(UserContext);
  
  useEffect(() => {
    if (!loading && (!user || user.role !== "CLIENT")) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

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

  if (!user || user.role !== "CLIENT") {
    return null; 
  }

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      bgcolor: "#121212", 
      color: "white"
    }}>
      <CssBaseline />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
     
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
          <Box sx={{ position: 'absolute', right: 40, bottom: -15, opacity: 0.2 }}>
            <WelcomeImage sx={{ fontSize: 180, color: 'white' }} />
          </Box>
          
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={2}>
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
                  Manage your projects and track your progress from your personal dashboard
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
                      {user.user?.coins} Coins
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Paper>

        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <Paper 
                elevation={4}
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  bgcolor: "#222",
                  backdropFilter: 'blur(10px)',
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
        </Container>
      </Box>
    </Box>
  );
}

export default ClientDashboard;