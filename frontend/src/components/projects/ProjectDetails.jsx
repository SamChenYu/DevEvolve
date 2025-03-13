import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProjectDetails } from '../../services/ProjectService';
import { Box, Typography, CircularProgress, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from '../layout/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ViewBidsModal from './ViewBidsModal';

const ProjectDetails = () => {
    const {clientId, projectId} = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [developerHired, setDeveloperHired] = useState(false);
    
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetchProjectDetails(clientId, projectId);
                console.log(response);
                setProject(response);
                const hired = response.status !== "FINDING_DEVELOPER";
                setDeveloperHired(hired);
                console.log(hired);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching project details:", error);
                setLoading(false);
            }
        };

        fetchDetails();
    }, [clientId, projectId]);

    const handleDeveloperHired = () => {
        setDeveloperHired(true);
        setProject(prev => ({ ...prev, status: "IN_PROGRESS" }));
    };

    if (loading) return <CircularProgress color="secondary" />;
    if (!project) return <Typography color="gray">Project not found.</Typography>;

    const statusColors = {
        FINDING_DEVELOPER: "orange",
        IN_PROGRESS: "blue",
        COMPLETED: "green",
        ARCHIVED: "gray",
        LATE: "red"
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
            <CssBaseline />
            <Sidebar />

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
                            bgcolor: statusColors[project.status]
                        }}>
                            <Typography variant="body1" fontWeight={600}>
                                {project.status.replace("_", " ")}
                            </Typography>
                        </Box>
                    </Box>
                    
                    {developerHired ? (
                        
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 4,
                                mx: 4,
                                px: 4,
                                py: 1,
                                opacity: 1,  
                                pointerEvents: "none", 
                                cursor: "not-allowed",
                            }}
                        >
                            Developer Hired
                        </Button>
                    ) : (
                        
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 4, mx: 4, px: 4, py: 1 }}
                            onClick={() => setOpen(true)}
                        >
                            View Bids
                        </Button>
                    )}

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
            <ViewBidsModal open={open} onClose={() => setOpen(false)} projectId={projectId} clientId={clientId} onDeveloperHired={handleDeveloperHired} />
        </Box>
    )
}

export default ProjectDetails;
