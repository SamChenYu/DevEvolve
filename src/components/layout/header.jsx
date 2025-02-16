import React from 'react'
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import useScrollTrigger from '@mui/material/useScrollTrigger';

const header = () => {
    const navigate = useNavigate();
    const trigger = useScrollTrigger();

    return (
        <AppBar 
                position="fixed" 
                elevation={trigger ? 4 : 0}
                sx={{ 
                    background: trigger ? "rgba(255, 255, 255, 0.95)" : "transparent",
                    backdropFilter: trigger ? "blur(8px)" : "none",
                    transition: "all 0.3s",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                    <Typography 
                        variant="h5" 
                        sx={{ fontWeight: 700, color: trigger ? "secondary.main" : "white" }}
                    >
                        DevEvolve
                    </Typography>

                    {/* Navigation Buttons */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            color="secondary"
                            onClick={() => navigate("/client-registration")}
                        >
                            Register as Client
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="secondary"
                            onClick={() => navigate("/developer-registration")}
                        >
                            Register as Developer
                        </Button>
                        <Button 
                            variant="contained" 
                            color="secondary"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
    )
}

export default header;