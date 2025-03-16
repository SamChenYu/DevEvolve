
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';


const Chat = () => {


    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    if(loading) {
        return <Typography variant="h4">Loading...</Typography>;
    }


    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
          <CssBaseline />
          
          <Sidebar />
          <Typography variant="h4">Chat</Typography>
    
    
        </Box>
      );
    }


export default Chat;