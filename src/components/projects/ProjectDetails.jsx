import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProjectDetails } from '../../services/ProjectService';
import { Box, Typography, CircularProgress, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from '../layout/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';


const ProjectDetails = () => {
    const {clientId, projectId} = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetchProjectDetails(clientId, projectId);
                console.log('Project details:', response);
                setProject(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching project details:", error);
                setLoading(false);
            }
        };

        fetchDetails();
    }, [clientId, projectId]);

    if (loading) return <CircularProgress color="secondary" />;
    if (!project) return <Typography color="gray">Project not found.</Typography>;

    const menuItems = [
        { text: "Browse Developers", icon: <PersonSearchIcon />, onClick: () => navigate("/browse-developers") },
        { text: "Create Project", icon: <CreateIcon />, onClick: () => navigate("/create-project") },
        { text: "Profile", icon: <AccountCircleIcon />, onClick: () => navigate("/profile") },
    ];

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
            <CssBaseline />
            <Sidebar menuItems={menuItems} />


            <Box component="main" sx={{ flexGrow: 1, p: 4, position: "relative" }}>

                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        color: "white",
                        bgcolor: "#333",
                        borderRadius: "50%",
                        "&:hover": { bgcolor: "#555" }
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>

      
                <Box sx={{ maxWidth: "800px", mx: "auto", textAlign: "center", mt: 6 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        {project.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {project.description}
                    </Typography>

             
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "#222",
                            px: 3,
                            py: 1,
                            borderRadius: 2
                        }}>
                            <MonetizationOnIcon sx={{ color: '#FFD700', mr: 1 }} />
                            <Typography variant="body1">{`Cost: ${project.cost}`}</Typography>
                        </Box>
                        <Box sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: project.completed ? "green" : "orange"
                        }}>
                            <Typography variant="body1" fontWeight={600}>
                                {project.completed ? "✅ Completed" : "🕒 In Progress"}
                            </Typography>
                        </Box>
                    </Box>


                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 4, px: 4, py: 1 }}
                        onClick={() => navigate(-1)}
                    >
                        Back to Projects
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ProjectDetails