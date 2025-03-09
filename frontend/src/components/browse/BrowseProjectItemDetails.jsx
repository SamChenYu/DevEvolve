import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { browseProjectDetails } from '../../services/ProjectService';
import Sidebar from '../layout/Sidebar';
import { Box, Card, CardContent, Typography, IconButton, CardMedia, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateBidModal from '../bids/CreateBidModal';
import { UserContext } from '../../context/UserContext';


const BrowseProjectItemDetails = () => {
  const { user, loading } = useContext(UserContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "DEVELOPER")) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  useEffect(() => {
    browseProjectDetails(projectId)
      .then(setProject)
      .catch((error) => console.error('Error fetching project details:', error));
  }, [projectId, open]);

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
            <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}><strong>Posted At:</strong> {new Date(project.postedAt).toLocaleDateString("en-US", { year: "numeric", month: "long",day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })} </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}><strong>Amount of Bids:</strong> {project.bids.length > 0 ? project.bids.length : 0}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>Place Bid</Button>
          </CardContent>
        </Card>
      </Box>
      <CreateBidModal 
        open={open} 
        handleClose={() => setOpen(false)} 
        developerId={user.user?.id}  
        projectId={project.id} 
        developerLevel={user.user?.level}
      />
    </Box>
  );
};

export default BrowseProjectItemDetails;
