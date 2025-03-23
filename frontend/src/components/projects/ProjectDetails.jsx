import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { browseProjectDetails, fetchProjectDetails, handleRatingSubmit, fetchProjectRating, modifyProject, deleteProject, minBidLevel } from '../../services/ProjectService';
import { getDeveloperById } from '../../services/AuthenicationService';
import { Box, Typography, CircularProgress, Button, IconButton, Paper, Grid, Divider, useTheme, Dialog, Slide, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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
import { UserContext } from '../../context/UserContext';


const ProjectDetails = () => {
    const { clientId, projectId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [project, setProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [developerHired, setDeveloperHired] = useState(false);
    const [devLoading, setDevLoading] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [hasRated, setHasRated] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [minBid, setMinBid] = useState(0);

    const [modifyModalOpen, setModifyModalOpen] = useState(false);  
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        repoLink: ''
    });
    
    
    const secondaryColor = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    const { user, loading } = useContext(UserContext);
      
    useEffect(() => {
    if (!loading && (!user || (user.role !== "CLIENT" && user.role !== "ADMIN"))) {
        navigate("/login");
    }
    }, [navigate, user, loading]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetchProjectDetails(clientId, projectId);
                setProject(response);
                setFormData({
                    title: response.title,
                    description: response.description,
                    repoLink: response.repoLink
                });
                const hired = response.status !== "FINDING_DEVELOPER";
                setDeveloperHired(hired);
                const ratingData = await fetchProjectRating(projectId);
                setHasRated(ratingData !== null && ratingData !== undefined && ratingData !== "");
                setProjectLoading(false);
            } catch (error) {
                console.error("Error fetching project details:", error);
                setProjectLoading(false);
            }
        };

        fetchDetails();
    }, [clientId, projectId]);

    useEffect(() => {
        if (user?.user?.level) {
          minBidLevel(user.user.level)
            .then((minAmount) => setMinBid(minAmount))
            .catch((error) => console.error('Error fetching min bid:', error));
        }
      }, [user]);

    if (loading) {
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

    if (!user || (user.role !== "CLIENT" && user.role !== "ADMIN")) {
    return null; 
    }

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

    if (projectLoading) {
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

    const handleModifyClick = () => {
        setModifyModalOpen(true);
    };

    const handleModifySubmit = async () => {
        try {
            await modifyProject(projectId, formData);
            alert("Project modified successfully!");
            setModifyModalOpen(false);
            window.location.reload(); 
        } catch (error) {
            alert("Failed to modify project. Please try again.");
            console.error("Error modifying project:", error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDeleteProject = async () => {
        try {
            await deleteProject(projectId);
            navigate(`/client-dashboard`);
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project. Please try again.");
        }
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

                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                            
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

                            {(clientId == user.user?.id || user.role === "ADMIN") && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleModifyClick}
                                        sx={{
                                            fontWeight: 600,
                                            py: 1.5,
                                            mt: 2
                                        }}
                                    >
                                        Modify Project
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={() => setDeleteModalOpen(true)}
                                        sx={{
                                            fontWeight: 600,
                                            py: 1.5,
                                            mt: 2
                                        }}
                                    >
                                        Delete Project
                                    </Button>
                                </>
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
                user={user}
                minBid={minBid}
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

                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                <IconButton sx={{ color: "#1877F2", bgcolor: "rgba(255,255,255,0.05)" }}>
                                    <Facebook />
                                </IconButton>
                                <IconButton sx={{ color: "#1DA1F2", bgcolor: "rgba(255,255,255,0.05)" }}>
                                    <Twitter />
                                </IconButton>
                                <IconButton sx={{ color: "#0A66C2", bgcolor: "rgba(255,255,255,0.05)" }}>
                                    <LinkedIn />
                                </IconButton>
                                <IconButton sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.05)" }}>
                                    <GitHub />
                                </IconButton>
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

            <Modal open={modifyModalOpen} onClose={() => setModifyModalOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#222', p: 3, borderRadius: 2, color: 'white', width: 350 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Modify Project</Typography>
                    
                    <TextField
                        label="Title"
                        fullWidth
                        variant="outlined"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' } }}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' } }}
                    />
                
                    <TextField
                        label="RepoLink"
                        fullWidth
                        variant="outlined"
                        name="repoLink"
                        value={formData.cost}
                        onChange={handleFormChange}
                        sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' } }}
                    />

                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={handleModifySubmit}
                        sx={{ mt: 2 }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Modal>  

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} >
                <Box sx={{ bgcolor: '#222', color: 'white' }}>

                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this project? This action cannot be undone.</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleDeleteProject} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}

export default ProjectDetails;