import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { browseProjectDetails, getDeveloperBid, completeProject, fetchProjectRating } from '../../services/ProjectService';
import Sidebar from '../layout/Sidebar';
import { Box, Card, CardContent, Typography, IconButton, CardMedia, CircularProgress, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateBidModal from '../bids/CreateBidModal';
import { UserContext } from '../../context/UserContext';
import CompleteProjectModal from './CompleteProjectModal';
import ReviewModal from './ReviewModal';

const bidStatusLabels = {
  PENDING: { label: "Pending", color: "warning" },
  ACCEPTED: { label: "Accepted", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
};

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


  useEffect(() => {
    if (!loading && (!user || user.role !== "DEVELOPER")) {
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
  }, [projectId, project, open]);

  

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
          console.log("Rating fetched successfully:", response);
        } catch (error) {
          console.error("Error fetching project rating:", error);
        }
      };
  
      fetchRating();
    
  }, []);

  

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
    <Box sx={{ display: 'flex', backgroundColor: '#121212', height: '100vh', color: 'white' }}>
      <Sidebar />
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
      <Box sx={{ flexGrow: 1, p: 3 }}>
        
        <Card sx={{ backgroundColor: '#1E1E1E', color: 'white', p: 3 }}>
          <CardMedia
            component="img"
            height="250"
            image="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=170667a&w=0&k=20&c=Q7gLG-xfScdlTlPGFohllqpNqpxsU1jy8feD_fob87U="
            alt="Project Image"
          />
          <CardContent>
            <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>{project.title}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>{project.description}</Typography>
            <Typography variant="bod</Typography>y2" sx={{ mt: 2, color: 'gray' }}>
              <strong>Posted At:</strong> {new Date(project.postedAt).toLocaleDateString("en-US", { 
                year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true 
              })} 
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
              <strong>Amount of Bids:</strong> {project.bids.length > 0 ? project.bids.length : 0}
            </Typography>

            {bid ? (
                <Box sx={{ mt: 2 }} display="flex" justifyContent="space-evenly" alignItems="center">
                  
                  <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
                    <Typography variant="body1" sx={{ mr: 1, color: "gray" }}>
                      Bid Status:
                    </Typography>
                    <Chip 
                      label={bidStatusLabels[bid.status]?.label || "Unknown"} 
                      color={bidStatusLabels[bid.status]?.color || "default"} 
                    />
                  </Box>

                  
                  {bid.status === "ACCEPTED" && project.finalReport === null ? (
                    <>
                      <Button variant="contained" onClick={() => setOpenCompleteModal(true)}>
                        Complete Project
                      </Button>
                      <CompleteProjectModal
                        open={openCompleteModal}
                        handleClose={() => setOpenCompleteModal(false)}
                        handleSubmit={handleProjectCompletion}
                      />
                    </>
                  ) : bid.status === "ACCEPTED" && project.finalReport ? (
                    projectRating ? (
                      <>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          onClick={() => setOpenReviewModal(true)}
                        >
                          View Feedback
                        </Button>
                  
                        <ReviewModal 
                          open={openReviewModal} 
                          handleClose={() => setOpenReviewModal(false)} 
                          feedback={projectRating.feedback} 
                          rating={projectRating.ratingOutOfFive}
                        />
                      </>
                    ) : (
                      <Chip label={"Work sent for review"} color="warning" />
                    )
                  ) : null}
              </Box>
            ) : (
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
                Place Bid
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
      <CreateBidModal 
        open={open} 
        handleClose={() => setOpen(false)} 
        developerId={user.user?.id}  
        projectId={projectId} 
        developerLevel={user.user?.level}
      />
    </Box>
  );
};

export default BrowseProjectItemDetails;
