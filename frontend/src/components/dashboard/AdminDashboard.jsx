import React from 'react'
import { Box, CssBaseline, Paper, Container, Grid, Divider, Typography, useTheme } from '@mui/material'
import Sidebar from '../layout/Sidebar'
import { alpha } from '@mui/material/styles'
import WelcomeImage from '@mui/icons-material/EmojiPeople'
import DashboardIcon from '@mui/icons-material/Dashboard'
import IssuesList from './IssuesList'



const AdminDashboard = () => {
    const theme = useTheme();
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
                                    Welcome Back, Admin!
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: alpha('#fff', 0.8) }}>
                                    View and manage user issues through your dashboard.
                                </Typography>
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
                                    Issues
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.secondary.main, 0.2) }} />
                            <IssuesList />
                           
                        </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}

export default AdminDashboard;