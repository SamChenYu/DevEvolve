import React, { useState, useEffect, useContext } from 'react';
import {
    Box, CssBaseline, Typography, TextField, InputAdornment,
    List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../layout/Sidebar';
import {getAllClients, searchClients} from '../../services/AuthenicationService';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const BrowseClients =() => {

    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { user, loading: userLoading } = useContext(UserContext);


    useEffect(() => {
        if (!userLoading && (!user || (user.role !== "ADMIN"))) {
            navigate("/login");
        }
    }, [user, userLoading, navigate]);


    useEffect(() => {
        if (user && (user.role === "ADMIN")) {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const data = await getAllClients()
            console.log("Clients:", data);
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
        setLoading(false);
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            fetchClients();
            return;
        }

        try {
            const data = await searchClients(query);
            setClients(data);
        } catch (error) {
            console.error("Error searching clients:", error);
        }
    };


    if (userLoading) {
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
                <Typography variant="h4" sx={{ color: "white" }}>
                    Loading...
                </Typography>
            </Box>
        );
    }


    if (!user || (user.role !== "ADMIN")) {
        return null;
    }

    return(
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
            <CssBaseline />
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>Browse Clients</Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {loading ? (
                    <CircularProgress color="secondary" />
                ) : (
                    <List sx={{ bgcolor: "#1e1e1e", borderRadius: 2, p: 2 }}>
                        {clients.length > 0 ? (
                            clients.map((clients) => (
                                <ListItem
                                    key={clients.id}
                                    sx={{
                                        borderBottom: "1px solid #444",
                                        '&:hover': { border: "2px solid #9c27b0", borderRadius: "5px" }
                                    }}
                                    onClick={() => navigate(`/client-profile/${clients.id}`)}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 40, height: 40, mr: 3 }} src={clients.imageUrl}>
                                            {clients.firstName.charAt(0)}{clients.lastName.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${clients.firstName} ${clients.lastName}`}
                                        secondary={clients.email}
                                        primaryTypographyProps={{ style: { color: "white" } }}
                                        secondaryTypographyProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography>No clients found.</Typography>
                        )}
                    </List>
                )}
            </Box>
        </Box>
    );
}
export default BrowseClients;