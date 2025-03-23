import React from 'react'
import { Box, CssBaseline, Paper, Container, Grid, Typography, useTheme } from '@mui/material'
import Sidebar from '../layout/Sidebar'
import { alpha } from '@mui/material/styles'
import WelcomeImage from '@mui/icons-material/EmojiPeople'


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
            </Box>
        </Box>
    )
}

export default AdminDashboard;