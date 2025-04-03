import React, { useContext, useState } from 'react';
import { Box, CssBaseline, Paper, Typography, TextField, IconButton } from '@mui/material';
import Sidebar from '../layout/Sidebar';

import { UserContext } from '../../context/UserContext';
import ChatService from '../../services/ChatService';
import ChooseUserModal from './ChooseUserModal';

const AdminChat = () => {

    return (<div>
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
        <CssBaseline />      
        <Sidebar />
        </Box>
    </div>);
}

export default AdminChat;