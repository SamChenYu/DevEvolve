import React, { useContext, useState } from 'react';
import { Box, CssBaseline, Paper, Typography,
     TextField, IconButton, Grid, alpha, useTheme,
    Container, Avatar} from '@mui/material';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import SearchIcon from '@mui/icons-material/Search';

import ChatService from '../../services/ChatService';
import ChooseUserModal from './ChooseUserModal';

const AdminChat = () => {

    const { user, loading } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingProjects, setLoadingProjects] = useState(false);
    const theme = useTheme();

    if( loading ) {
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
      <div>
      <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <CssBaseline />
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" color="white" sx={{ fontWeight: 600, mb: 3 }}>
            Manage Chats
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for Users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
          />


        </Box>
      </Box>
      
      </div>
    );
}

export default AdminChat;