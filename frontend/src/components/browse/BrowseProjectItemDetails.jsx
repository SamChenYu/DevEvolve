import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { browseProjectDetails, getDeveloperBid, completeProject, fetchProjectRating } from '../../services/ProjectService';
import Sidebar from '../layout/Sidebar';
import { Box, Typography, Button, CircularProgress, Paper, Grid, Divider, Badge, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FactoryIcon from '@mui/icons-material/Factory';
import CreateBidModal from '../bids/CreateBidModal';
import { UserContext } from '../../context/UserContext';
import CompleteProjectModal from './CompleteProjectModal';
import ReviewModal from './ReviewModal';
import { getDeveloperById } from '../../services/AuthenicationService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';

const BrowseProjectItemDetails = () => {
  const { user, loading } = useContext(UserContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [bid, setBid] = useState(null);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [projectRating, setProjectRating] = useState(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const theme = useTheme();
  const img = new Image();
  
  const [clientName, setClientName] = useState("");
  useEffect(() => {
    const fetchClientName = async () => {
      if (project && project.clientId) {
        try {
          const client = await getDeveloperById(project.clientId);
          setClientName(client.firstName + " " + client.lastName);
        } catch (error) {
          console.error('Error fetching client name:', error);
        }
      }
    };
    fetchClientName();
  }, [project]);
  
  const secondaryColor = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;
  const secondaryDark = theme.palette.secondary.dark;

  
  const bidStatusStyles = {
    PENDING: { 
      label: "Pending Review", 
      color: theme.palette.warning.main, 
      backgroundColor: `${theme.palette.warning.main}10`
    },
    ACCEPTED: { 
      label: "Bid Accepted", 
      color: theme.palette.success.main, 
      backgroundColor: `${theme.palette.success.main}10`
    },
    REJECTED: { 
      label: "Not Selected", 
      color: theme.palette.error.main, 
      backgroundColor: `${theme.palette.error.main}10`
    },
  };

  useEffect(() => {
    if (!loading && (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN"))) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectDetails = await browseProjectDetails(projectId);
        setProject(projectDetails);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId, open]);

  useEffect(() => {
    const fetchBid = async () => {
      if (user && user.user?.id && projectId) {
        try {
          const response = await getDeveloperBid(user.user.id, projectId);
          if (response) {
            setBid(response);
          }
        } catch (error) {
          console.error("Error fetching bid status:", error);
        }
      }
    };

    fetchBid();
  }, [user, projectId]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetchProjectRating(projectId);
        setProjectRating(response);
      } catch (error) {
        console.error("Error fetching project rating:", error);
      }
    };

    fetchRating();
  }, [projectId]);

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const handleProjectCompletion = async (report) => {
    try {
      const response = await completeProject(projectId, report);
      setProject(response);
    } catch (error) {
      console.error("Error completing project:", error);
    }
  }

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', color: '#E0E0E0' }}>
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
              src={project.imageUrl?.trim() ? project.imageUrl : "/placeholder-image.png"}
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
                      <CalendarTodayIcon sx={{ color: '#8C8C8C', mr: 1.5, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#8C8C8C' }}>
                        Posted: {new Date(project.postedAt).toLocaleDateString("en-US", { 
                          year: "numeric", month: "long", day: "numeric"
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupsIcon sx={{ color: '#8C8C8C', mr: 1.5, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#8C8C8C' }}>
                        Proposals: {project.bids.length > 0 ? project.bids.length : 0}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ color: '#8C8C8C', mr: 1.5, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#00bcd4', cursor: 'pointer' }} onClick={() => navigate(`/client-profile/${project.clientId}`)}>
                        Posted By: {clientName}
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
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <EngineeringIcon sx={{ mr: 1.5, color: secondaryColor }} />
                Your Proposal
              </Typography>
              
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
              
              {bid ? (
                <Box sx={{ mt: 2 }}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 3,
                      bgcolor: bidStatusStyles[bid.status]?.backgroundColor || 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${bidStatusStyles[bid.status]?.color || '#666'}30`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: bidStatusStyles[bid.status]?.color || '#8C8C8C',
                        fontWeight: 600,
                      }}
                    >
                      {bidStatusStyles[bid.status]?.label || "Status Unknown"}
                    </Typography>
                  </Paper>
                  
                  {bid.status === "ACCEPTED" && project.finalReport === null ? (
                    <Button 
                      variant="contained" 
                      color="secondary"
                      fullWidth
                      onClick={() => setOpenCompleteModal(true)}
                      sx={{
                        fontWeight: 600,
                        py: 1.5,
                      }}
                    >
                      <CheckCircleIcon sx={{ mr: 1 }} />
                      Complete Project
                    </Button>
                  ) : bid.status === "ACCEPTED" && project.finalReport ? (
                    projectRating ? (
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        fullWidth
                        onClick={() => setOpenReviewModal(true)}
                        sx={{
                          fontWeight: 600,
                          py: 1.5,
                        }}
                      >
                        <FeedbackIcon sx={{ mr: 1 }} />
                        View Client Feedback
                      </Button>
                    ) : (
                      <Badge 
                        
                        color="warning"
                        sx={{ 
                          width: '100%',
                        }}
                      >
                        <Button 
                          variant="outlined" 
                          fullWidth
                     
                          sx={{
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#8C8C8C',
                            py: 1.5,
                            interaction: 'none',
                            cursor: 'none',
                          }}
                        >
                          Awaiting Client Review
                        </Button>
                      </Badge>
                    )
                  ) : null}
                </Box>
              ) : (
                <Button 
                  variant="contained" 
                  color="secondary"
                  fullWidth
                  onClick={() => setOpen(true)}
                  sx={{
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  <SendTimeExtensionIcon sx={{ mr: 1 }} />
                  Submit Proposal
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <CreateBidModal 
        open={open} 
        handleClose={() => setOpen(false)} 
        developerId={user.user?.id}  
        projectId={projectId} 
        developerLevel={user.user?.level}
      />
      
      <CompleteProjectModal
        open={openCompleteModal}
        handleClose={() => setOpenCompleteModal(false)}
        handleSubmit={handleProjectCompletion}
      />
      
      <ReviewModal 
        open={openReviewModal} 
        handleClose={() => setOpenReviewModal(false)} 
        feedback={projectRating?.feedback} 
        rating={projectRating?.ratingOutOfFive}
      />
    </Box>
  );
};

export default BrowseProjectItemDetails;