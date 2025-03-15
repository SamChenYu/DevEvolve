import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { browseProjectDetails, fetchProjectDetails, handleRatingSubmit, fetchProjectRating } from '../../services/ProjectService';
import { getDeveloperById } from '../../services/AuthenicationService';
import { Box, Typography, CircularProgress, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from '../layout/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ViewBidsModal from './ViewBidsModal';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';



const ProjectDetails = () => {
    const {clientId, projectId} = useParams();
    const navigate = useNavigate();
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
    
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetchProjectDetails(clientId, projectId);
                //console.log(response);
                setProject(response);
                const hired = response.status !== "FINDING_DEVELOPER";
                setDeveloperHired(hired);
                const ratingData = await fetchProjectRating(projectId);
                setHasRated(ratingData !== null);
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

    if (loading) return <CircularProgress color="secondary" />;
    if (!project) return <Typography color="gray">Project not found.</Typography>;

    const statusColors = {
        FINDING_DEVELOPER: "orange",
        IN_PROGRESS: "blue",
        COMPLETED: "green",
        ARCHIVED: "gray",
        LATE: "red"
    };

    const handleRatingSubmitClick = () => {
        
        handleRatingSubmit(projectId, rating, feedback)
            .then(() => {
                alert("Rating submitted successfully!");
                setRatingModalOpen(false);  
            })
            .catch((error) => {
                alert("Failed to submit rating. Please try again.");
                console.error("Rating submission failed:", error);
            });
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
                    
                    {project.status === "COMPLETED" && !hasRated && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 4, mx: 4, px: 4, py: 1 }}
                            onClick={() => setRatingModalOpen(true)}
                        >
                            Rate Developer
                        </Button>
                    )}

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
                                
                            }}
                            onClick={async () => handleViewDeveloper((await browseProjectDetails(projectId)).developerId)}
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
            <Modal open={!!selectedDeveloper} onClose={() => setSelectedDeveloper(null)}>
                <Box 
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350, bgcolor: '#222', color: 'white',
                        boxShadow: 24, p: 3, borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <IconButton onClick={() => setSelectedDeveloper(null)} sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>

                    {devLoading ? (
                        <CircularProgress color="secondary" sx={{ mt: 3 }} />
                    ) : selectedDeveloper ? (
                        <>
                            <Avatar 
                                sx={{ width: 80, height: 80, margin: "auto", bgcolor: "gray" }} 
                                src="/placeholder-profile.png" 
                                alt={`${selectedDeveloper.firstName} ${selectedDeveloper.lastName}`} 
                            />

                            <Typography variant="h5" sx={{ mt: 2 }}>{selectedDeveloper.firstName} {selectedDeveloper.lastName}</Typography>
                            <Typography variant="subtitle2" sx={{ color: "gray" }}>{selectedDeveloper.email}</Typography>

                            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
                                <IconButton sx={{ color: "white" }}><Facebook /></IconButton>
                                <IconButton sx={{ color: "white" }}><Twitter /></IconButton>
                                <IconButton sx={{ color: "white" }}><LinkedIn /></IconButton>
                                <IconButton sx={{ color: "white" }}><GitHub /></IconButton>
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
                        sx={{ mt: 3, bgcolor: "#333", color: "white" }}
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
    )
}

export default ProjectDetails;
