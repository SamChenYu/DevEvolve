import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { browseProjectDetails, fetchProjectDetails, handleRatingSubmit, fetchProjectRating, modifyProject, deleteProject, minBidLevel, archiveProject, fetchProjectsByDeveloper } from '../../services/ProjectService';
import { getDeveloperById } from '../../services/AuthenicationService';
import { Box, Typography, CircularProgress, Button, IconButton, Paper, Grid, Divider, useTheme, Dialog, Slide, DialogActions, DialogContent, DialogTitle, Alert, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from '../layout/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FactoryIcon from '@mui/icons-material/Factory';
import PersonIcon from '@mui/icons-material/Person';
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
import ChatService from '../../services/ChatService';  
import axios from 'axios';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ViewListIcon from '@mui/icons-material/ViewList';
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SourceIcon from '@mui/icons-material/Source';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; 
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(timezone);


const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const placeholderThumbnail = "https://images.squarespace-cdn.com/content/v1/649087af1b2b0e356cbd5516/1687193634202-J7IC7003UGR4EF0T0E3V/blank-thumbnail.jpg";


const ProjectDetails = () => {
    const { clientId, projectId } = useParams();
    const img = new Image();
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
    const [finalReportModalOpen, setFinalReportModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [modifyModalOpen, setModifyModalOpen] = useState(false);  
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        repoLink: '',
        imageUrl: ''
    });
    const [clientName, setClientName] = useState("");

    const [ratingDeadline, setRatingDeadline] = useState(null);
    const [showTimer, setShowTimer] = useState(false);
    
    
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
        const fetchClientName = async () => {
            try {
                const response = await getDeveloperById(clientId);
                
                setClientName(response.firstName + " " + response.lastName);
            } catch (error) {
                console.error("Error fetching client name:", error);
            }
        };
        fetchClientName();
    }, [clientId]);
   

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

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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

    const handleMessageDeveloper = async () => {
        try {
            // Firstly we need to get the developer ID from the project details
            const devData = await browseProjectDetails(projectId);
            console.log(devData);

            const response = await ChatService.newChat(user.user.id, devData.developerId);
            console.log(response);
            if (response) {
            if(response.chatID) {
                navigate(`/chat/${response.chatID}`);
            }
            } else {
            console.error("Failed to create chat.");
        }
        } catch (error) {
          console.error("Error creating chat:", error);
        }
      }


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
                setSuccessMessage("Rating submitted successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                setRatingModalOpen(false);
                window.location.reload();
            })
            .catch((error) => {
                setErrorMessage("Failed to submit rating. Please try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                console.error("Rating submission failed:", error);
            });
    };

    const handleModifyClick = () => {
        setModifyModalOpen(true);
    };

    const handleModifySubmit = async () => {
        try {
            await modifyProject(projectId, formData);
            setSuccessMessage("Project modified successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setModifyModalOpen(false);
            window.location.reload(); 
        } catch (error) {
            setErrorMessage("Failed to modify project. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
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
        console.log("Here.")
        try {
            await deleteProject(projectId);
            console.log("Here.")
            navigate(-1);
        } catch (error) {
            console.error("Error deleting project:", error);
            setErrorMessage("Failed to delete project. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!image) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const response = await axios.post(CLOUDINARY_URL, formData);
            setFormData((prevData) => ({ ...prevData, imageUrl: response.data.secure_url }));
            setSuccessMessage("Image uploaded successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            setErrorMessage("Image upload failed. Try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
        setUploading(false);
    };

    const isRatingDeadlineLater = async () => {
        const now = dayjs().tz('Europe/London'); 
        
        if (!ratingDeadline) {
            const response = await fetchProjectDetails(clientId, projectId);
            setRatingDeadline(response.ratingDeadlineReference);
            setProject(response);
        }

        const deadline = ratingDeadline || project.ratingDeadlineReference; 
        return deadline && dayjs(deadline).isAfter(now);
    };

    const getRemainingTime = () => {
        if (!project?.ratingDeadlineReference) return '';
        const deadline = dayjs(project.ratingDeadlineReference); // Parse deadline as a dayjs object
        const duration = dayjs.duration(deadline.diff(dayjs().tz('Europe/London')));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        return `${days} days ${hours} hours ${minutes} minutes`;
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

                            <img
                                src={project.imageUrl?.trim() ? project.imageUrl : placeholderThumbnail}
                                alt={project.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    maxHeight: 300,
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                    filter: 'brightness(0.8)',
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
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ color: '#8C8C8C', mr: 1.5, fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ color: '#00bcd4', cursor: 'pointer' }} onClick={() => navigate(`/client-profile/${clientId}`)}>
                                            Posted By: {(user.role === "ADMIN")? clientName : "You"}
                                        </Typography>
                                        </Box>
                                    </Grid>
                                    {project.repoLink && (
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <SourceIcon sx={{ color: '#8C8C8C', mr: 1.5, fontSize: 20 }} />
                                                <Typography variant="body2" sx={{ color: '#00bcd4', cursor: 'pointer', mr: 1.5 }}>
                                                    Repository Link: {project.repoLink}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    
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
                            
                            {project.status === "COMPLETED" && !hasRated && isRatingDeadlineLater() && (
                                <Button 
                                    variant="contained" 
                                    color="secondary"
                                    fullWidth
                                    onClick={() => setRatingModalOpen(true)}
                                    sx={{
                                        fontWeight: 600,
                                        py: 1.5,
                                    }}
                                    onMouseEnter={() => setShowTimer(true)}
                                    onMouseLeave={() => setShowTimer(false)}
                                >
                                    <RateReviewIcon sx={{ mr: 1 }} />
                                    Rate Developer
                                    
                                    {showTimer && (
                                        <Typography style={{ marginLeft: 8, fontSize: '0.85rem', color: 'white' }}>
                                            Time Remaining to Review Developer {getRemainingTime()}
                                        </Typography>
                                    )}
                                </Button>
                            )}

                            {(project.status === "COMPLETED" || project.status === "LATE" || project.status === "ARCHIVED") && project.finalReport && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => setFinalReportModalOpen(true)}
                                    sx={{
                                        fontWeight: 600,
                                        py: 1.5,
                                        mt: 2
                                    }}
                                >
                                    <SummarizeIcon sx={{ mr: 1 }} />
                                    View Final Report
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
                                    <PersonIcon sx={{ mr: 1 }} />
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
                                    <ViewListIcon sx={{ mr: 1 }} />
                                    View Bids
                                </Button>
                            )}

                            {(user.role === "CLIENT" && (project.status !== "FINDING_DEVELOPER")) && (
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    sx={{ 
                                        fontWeight: 600,
                                        py: 1.5,
                                        mt: 2,
                                        color: "primary",
                                    }}
                                    onClick={() => handleMessageDeveloper()}
                                >
                                    <ChatIcon sx={{ mr: 1 }} />
                                    Message Developer
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
                                        <EditIcon sx={{ mr: 1 }} />
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
                                        <DeleteIcon sx={{ mr: 1 }} />
                                        Delete Project
                                    </Button>

                                    { project.status === "COMPLETED" &&
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        sx={{
                                            fontWeight: 600,
                                            py: 1.5,
                                            mt: 2
                                        }}
                                        onClick={() => {archiveProject(projectId); navigate(`/client-dashboard`);}}
                                    >
                                        <ArchiveIcon sx={{ mr: 1 }} />
                                        Archive Project
                                    </Button>
                                    }

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
                                src={ selectedDeveloper.imageUrl || "/placeholder-profile.png" } 
                                alt={`${selectedDeveloper.firstName} ${selectedDeveloper.lastName}`} 
                            />

                            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                                {selectedDeveloper.firstName} {selectedDeveloper.lastName}
                            </Typography>
                            
                            <Typography variant="subtitle2" sx={{ color: '#8C8C8C', mb: 2 }}>
                                {selectedDeveloper.email}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 1, color: '#00bcd4', cursor: 'pointer' }} onClick={() => navigate(`/dev-profile/${selectedDeveloper.id}`)}>
                                View Profile
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

            <Modal open={finalReportModalOpen} onClose={() => setFinalReportModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#222', color: 'white',
                        boxShadow: 24, p: 3, borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <IconButton 
                        onClick={() => setFinalReportModalOpen(false)} 
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
                    <Typography variant="h5" fontWeight={600} sx={{ mt: 2 }}>Final Report</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {project.finalReport}
                    </Typography>
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
                        sx={{
                            "& .MuiRating-icon": {
                            color: "white",
                            },
                            "& .MuiRating-iconFilled": {
                            color: "inherit",
                            },
                            "& .MuiRating-iconHover": {
                            color: "inherit", 
                            }
                        }} 
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
                        sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '& .MuiInputLabel-root': { color: 'white' }}}
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
                        sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '& .MuiInputLabel-root': { color: 'white' } }}
                    />
                
                    <TextField
                        label="RepoLink"
                        fullWidth
                        variant="outlined"
                        name="repoLink"
                        value={formData.repoLink}
                        onChange={handleFormChange}
                        sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '& .MuiInputLabel-root': { color: 'white' } }}
                    />

                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: 'white' }} />
                    <Button onClick={handleImageUpload} variant="contained" color="primary" sx={{ mt: 1 }}>
                        {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Image'}
                    </Button>

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
                        <Button onClick={() => handleDeleteProject()} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '150%' }}>
                    {snackbarSeverity === "success" ? successMessage : errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ProjectDetails;