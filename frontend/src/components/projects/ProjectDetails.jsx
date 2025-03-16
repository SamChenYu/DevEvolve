import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { browseProjectDetails, fetchProjectDetails, handleRatingSubmit, fetchProjectRating } from '../../services/ProjectService';
import { getDeveloperById } from '../../services/AuthenicationService';
import { Box, Typography, CircularProgress, Button, IconButton, Paper, Grid, Divider, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from '../layout/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FactoryIcon from '@mui/icons-material/Factory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import ViewBidsModal from './ViewBidsModal';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';

const ProjectDetails = () => {
    const { clientId, projectId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [developerHired, setDeveloperHired] = useState(false);
    const [devLoading, setDevLoading] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [hasRated, setHasRated] = useState(false);
    
    const secondaryColor = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetchProjectDetails(clientId, projectId);
                setProject(response);
                const hired = response.status !== "FINDING_DEVELOPER";
                setDeveloperHired(hired);
                const ratingData = await fetchProjectRating(projectId);
                setHasRated(ratingData !== null && ratingData !== undefined && ratingData !== "");
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

    const handleViewDeveloper = async (developerId) => {
        setDevLoading(true);
        try {
            const devData = await getDeveloperById(developerId);
            setSelectedDeveloper(devData);
        } catch (error) {
            console.error("Error fetching developer details:", error);
        }
        setDevLoading(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }
    
    if (!project) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
                <Typography color="gray">Project not found.</Typography>
            </Box>
        );
    }

    const statusStyles = {
        FINDING_DEVELOPER: { 
            label: "Finding Developer", 
            color: theme.palette.warning.main, 
            backgroundColor: `${theme.palette.warning.main}10`
        },
        IN_PROGRESS: { 
            label: "In Progress", 
            color: theme.palette.info.main, 
            backgroundColor: `${theme.palette.info.main}10`
        },
        COMPLETED: { 
            label: "Completed", 
            color: theme.palette.success.main, 
            backgroundColor: `${theme.palette.success.main}10`
        },
        ARCHIVED: { 
            label: "Archived", 
            color: theme.palette.grey[500], 
            backgroundColor: `${theme.palette.grey[500]}10`
        },
        LATE: { 
            label: "Late", 
            color: theme.palette.error.main, 
            backgroundColor: `${theme.palette.error.main}10`
        }
    };

    const handleRatingSubmitClick = () => {
        handleRatingSubmit(projectId, rating, feedback)
            .then(() => {
                alert("Rating submitted successfully!");
                setRatingModalOpen(false); 
                window.location.reload(); 
            })
            .catch((error) => {
                alert("Failed to submit rating. Please try again.");
                console.error("Rating submission failed:", error);
            });
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', color: '#E0E0E0' }}>
            <CssBaseline />
            <Sidebar />
            
            <Button
                onClick={() => navigate(-1)}
                startIcon={<ArrowBackIcon />}
                sx={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    color: "#E0E0E0",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" }
                }}
            >
                Back
            </Button>
            
            <Box sx={{ flexGrow: 1, p: 3, mt: 6, mx: { xs: 2, md: 6 } }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper 
                            sx={{ 
                                backgroundColor: '#1E1E1E', 
                                backgroundImage: `linear-gradient(to right, ${secondaryColor}05, transparent)`,
                                color: '#E0E0E0', 
                                p: 0, 
                                borderRadius: 2,
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                                overflow: 'hidden',
                            }}
                        >
                            <Box 
                                sx={{ 
                                    height: 12, 
                                    background: `linear-gradient(90deg, ${secondaryColor}, ${secondaryLight})`,
                                }}
                            />
                            
                            <Box sx={{ p: 4 }}>
                                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <FactoryIcon sx={{ fontSize: 28, color: secondaryColor, mr: 2 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                                        {project.title}
                                    </Typography>
                                </Box>
                                
                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />
                                
                                <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#B8B8B8' }}>
                                    {project.description}
                                </Typography>
                                
                                <Grid container spacing={3} sx={{ mt: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <MonetizationOnIcon sx={{ color: '#FFD700', mr: 1.5, fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                                                Cost: {project.cost}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarTodayIcon sx={{ color: '#8C8C8C', mr: 1.5, fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ color: '#8C8C8C' }}>
                                                {project.postedAt && new Date(project.postedAt).toLocaleDateString("en-US", { 
                                                    year: "numeric", month: "long", day: "numeric"
                                                })}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Paper 
                            sx={{ 
                                backgroundColor: '#1E1E1E', 
                                color: '#E0E0E0', 
                                p: 3, 
                                borderRadius: 2,
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                                mb: 4
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                <GroupsIcon sx={{ mr: 1.5, color: secondaryColor }} />
                                Project Status
                            </Typography>
                            
                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                            
                            <Paper
                                sx={{
                                    p: 2,
                                    mb: 3,
                                    bgcolor: statusStyles[project.status]?.backgroundColor || 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${statusStyles[project.status]?.color || '#666'}30`,
                                    borderRadius: 1,
                                }}
                            >
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        color: statusStyles[project.status]?.color || '#8C8C8C',
                                        fontWeight: 600,
                                    }}
                                >
                                    {statusStyles[project.status]?.label || project.status.replace("_", " ")}
                                </Typography>
                            </Paper>
                            
                            {project.status === "COMPLETED" && !hasRated && (
                                <Button 
                                    variant="contained" 
                                    color="secondary"
                                    fullWidth
                                    onClick={() => setRatingModalOpen(true)}
                                    sx={{
                                        fontWeight: 600,
                                        py: 1.5,
                                    }}
                                >
                                    Rate Developer
                                </Button>
                            )}
                            
                            {developerHired ? (
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    fullWidth
                                    onClick={async () => handleViewDeveloper((await browseProjectDetails(projectId)).developerId)}
                                    sx={{
                                        fontWeight: 600,
                                        py: 1.5,
                                        mt: 2
                                    }}
                                >
                                    View Developer Profile
                                </Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="secondary"
                                    fullWidth
                                    onClick={() => setOpen(true)}
                                    sx={{
                                        fontWeight: 600,
                                        py: 1.5,
                                        mt: 2
                                    }}
                                >
                                    View Bids
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            
            <ViewBidsModal 
                open={open} 
                onClose={() => setOpen(false)} 
                projectId={projectId} 
                clientId={clientId} 
                onDeveloperHired={handleDeveloperHired} 
            />
            
            <Modal open={!!selectedDeveloper} onClose={() => setSelectedDeveloper(null)}>
                <Box 
                    sx={{
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350, 
                        bgcolor: '#1E1E1E', 
                        color: '#E0E0E0',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)', 
                        p: 3, 
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'center'
                    }}
                >
                    <IconButton 
                        onClick={() => setSelectedDeveloper(null)} 
                        sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            color: '#E0E0E0',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {devLoading ? (
                        <CircularProgress color="secondary" sx={{ mt: 3 }} />
                    ) : selectedDeveloper ? (
                        <>
                            <Avatar 
                                sx={{ 
                                    width: 80, 
                                    height: 80, 
                                    margin: "auto", 
                                    bgcolor: secondaryColor,
                                    border: '2px solid rgba(255, 255, 255, 0.1)'
                                }} 
                                src="/placeholder-profile.png" 
                                alt={`${selectedDeveloper.firstName} ${selectedDeveloper.lastName}`} 
                            />

                            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                                {selectedDeveloper.firstName} {selectedDeveloper.lastName}
                            </Typography>
                            
                            <Typography variant="subtitle2" sx={{ color: '#8C8C8C', mb: 2 }}>
                                {selectedDeveloper.email}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Facebook sx={{ color: '#1877F2', mx: 1 }} />
                                <Twitter sx={{ color: '#1DA1F2', mx: 1 }} />
                                <LinkedIn sx={{ color: '#0A66C2', mx: 1 }} />
                                <GitHub sx={{ color: '#181717', mx: 1 }} />
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body1">Developer not found.</Typography>
                    )}
                </Box>
            </Modal> 
            <Modal open={ratingModalOpen} onClose={() => setRatingModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350, bgcolor: '#222', color: 'white',
                        boxShadow: 24, p: 3, borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <IconButton onClick={() => setRatingModalOpen(false)} sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h5" sx={{ mt: 2 }}>Rate Developer</Typography>

                    <Box sx={{ mt: 2 }}>
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                            precision={1}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mt: 3, bgcolor: "#333", color: "white", '& .MuiInputBase-input': { color: "white" }, '& .MuiOutlinedInput-notchedOutline': { borderColor: "rgba(255, 255, 255, 0.1)" } , '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: "rgba(255, 255, 255, 0.3)" }, '& .MuiInputLabel-root': { color: "white" }}}
                        label="Feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={handleRatingSubmitClick}
                    >
                        Submit Rating
                    </Button>
                </Box>
            </Modal>   
        </Box>
    );
}

export default ProjectDetails;