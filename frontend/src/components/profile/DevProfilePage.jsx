import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { getDeveloperById as getUser, updateDeveloperProfile, deleteDeveloperProfile } from '../../services/AuthenicationService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import { useTheme } from '@mui/material/styles';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { Box, Typography, TextField, Avatar, Grid, Paper, IconButton, Divider, Chip, CssBaseline, CircularProgress, Button, Modal, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Popover, LinearProgress, Alert, Snackbar } from '@mui/material';
import { ArrowBack, GitHub, LinkedIn, Twitter, Facebook, Edit, Code, Star, Language, Verified } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { fetchProjectsByDeveloper } from '../../services/ProjectService';
import Slider from 'react-slick';
import { alpha } from '@mui/material';
import BrowseProjectItem from '../browse/BrowseProjectItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TerminalIcon from '@mui/icons-material/Terminal';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ChatService from '../../services/ChatService';

import axios from 'axios';


const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const getLevelData = (coins) => {
  if (coins >= 50000) {
    return { level: "Expert", next: null, progress: 100 };
  } else if (coins >= 20000) {
    return {
      level: "Advanced",
      next: 50000,
      progress: ((coins - 20000) / (50000 - 20000)) * 100,
    };
  } else if (coins >= 5000) {
    return {
      level: "Intermediate",
      next: 20000,
      progress: ((coins - 5000) / (20000 - 5000)) * 100,
    };
  } else {
    return {
      level: "Novice",
      next: 5000,
      progress: (coins / 5000) * 100,
    };
  }
};

const DevProfilePage = () => {
    const { user, loading } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [developer, setDeveloper] = useState(null);
    const [userLoading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState({ inProgress: [], completed: [] });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const theme = useTheme();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        imageUrl: "",
    });

    const [openEditModal, setOpenEditModal] = useState(false);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    

    useEffect(() => {
      if (!loading && !user) {
        navigate("/login");
      }
    }, [navigate, user, loading]);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const data = await getUser(id);
            setDeveloper(data);
            
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                imageUrl: data.imageUrl,
            });
          } catch (error) {
            console.error("Error fetching developer profile:", error);
          }
          setLoading(false);
        };
    
        fetchUser();
      }, [user, loading]);

    useEffect(() => {
        if (user?.user?.id) {
          fetchProjectsByDeveloper(id)
            .then((data) => {
              const inProgress = data.filter((p) => p.status === "IN_PROGRESS");
              const completed = data.filter((p) => p.status === "COMPLETED");
              setProjects({ inProgress, completed });
            })
            .catch((err) => console.error("Error fetching developer projects:", err));
        }
      }, [user]);
  
    const handleOpenEditModal = () => setOpenEditModal(true);
    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
      
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

    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 2,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    };

    const coins = developer?.coinsEarnedAllTime || 0;
    const levelData = getLevelData(coins);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
      try {
          await updateDeveloperProfile(id, formData);
          setDeveloper(prevState => ({
              ...prevState,
              ...formData
          }));
          handleCloseEditModal();  
      } catch (error) {
          console.error("Error updating profile:", error);
      }
  };

  const handleDeleteProfile = async () => {
      try {
          await deleteDeveloperProfile(id);
          if (user.role === "ADMIN") {
              navigate(-1);
          }
          else {
              navigate('/logout');
          }
      } catch (error) {
          console.error("Error deleting profile:", error);
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

  const handleMessageDeveloper = async () => {
    console.log("Message Developer clicked");
    try {
      console.log("Creating chat with developer ID:", developer.id);
      console.log("User ID:", user.user.id);
      const response = await ChatService.newChat(user.user.id, developer.id);
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

  
  const skills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'GraphQL', 'UI/UX'];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212", color: "white" }}>
      <CssBaseline />
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>

        <Box 
          sx={{ 
            p: 2, 
            display: "flex", 
            alignItems: "center", 
            position: "absolute", 
            top: 0, 
            left: 10, 
            width: "100%", 
            zIndex: 2
          }}
        >
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ color: "white", bgcolor: "rgba(0,0,0,0.3)", mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Developer Profile</Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : developer ? (
          <>
            
            <Box 
              sx={{ 
                height: "240px", 
                background: "linear-gradient(135deg, #9c27b0 0%, #4a148c 100%)",
                position: "relative",
              }}
            >
        
              {(user.user?.id == id || user.role === "ADMIN") && (
                <>
                  <Chip
                    icon={<Edit size="small"/>}
                    label="Edit Profile"
                    sx={{ 
                      position: "absolute", 
                      padding: 2,
                      right: 16, 
                      top: 64, 
                      bgcolor: "rgba(0,0,0,0.5)", 
                      color: "white", 
                      border: "1px solid rgba(255,255,255,0.2)" 
                    }}
                    onClick={handleOpenEditModal}
                  />
                  <Chip
                    icon={<DeleteIcon size="small"/>}
                    label="Delete Profile"
                    sx={{ 
                      position: "absolute", 
                      padding: 2,
                      right: 16, 
                      top: 120, 
                      bgcolor: "rgba(0,0,0,0.5)", 
                      color: "white", 
                      border: "1px solid rgba(255,255,255,0.2)" 
                    }}
                    onClick={() => setDeleteModalOpen(true)}
                    
                  />
                </>
              )}
            </Box>
            
       
            <Box sx={{ display: "flex", justifyContent: "center", mt: "-80px" }}>
              <Avatar 
                sx={{ 
                  width: 160, 
                  height: 160, 
                  border: "4px solid #121212",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                }} 
                src={ developer.imageUrl || "/api/placeholder/400/400" }
                alt={developer.firstName ? `${developer.firstName} ${developer.lastName}` : "Developer"}
              />
            </Box>
            
        
            <Box sx={{ textAlign: "center", mt: 2, px: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {developer.firstName ? `${developer.firstName} ${developer.lastName}` : "Developer"}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ color: "#9c27b0", mb: 1 }}>
                {developer.role || "Full Stack Developer"}
              </Typography>
              
              <Typography variant="body2" color="white">
                {developer.email || "email</Box>@example.com"}
              </Typography>

              <Box 
                onMouseEnter={(e) => {setHovered(true); setAnchorEl(e.currentTarget);}}
                onMouseLeave={() => {setHovered(false); setAnchorEl(null);}} 
                sx={{ display: "inline-block", mt: 2 }}
              >
                <Typography 
                  variant="body2" 
                  color="white" 
                  sx={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                >
                  <WorkspacePremiumIcon sx={{ mr: 1 }} /> Level: {levelData.level}
                </Typography>

                <Popover
                  id="level-popover"
                  open={hovered}
                  anchorEl={anchorEl}
                  onClose={() => setHovered(false)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  PaperProps={{
                    sx: { p: 2, bgcolor: "#1e1e1e", color: "white", borderRadius: 2, width: 250 },
                    onMouseEnter: () => setHovered(true),
                    onMouseLeave: () => setHovered(false),
                  }}
                  disableRestoreFocus
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Progress to {levelData.next ? `next level (${levelData.next} coins)` : "max level"}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={levelData.progress} 
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#333",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#9c27b0"
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, display: "block", textAlign: "right" }}>
                    {coins} / {levelData.next || coins} coins
                  </Typography>
                </Popover>
              </Box>
              
          
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
            </Box>
            
            <Divider sx={{ mt: 3, mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />
            

            <Grid container spacing={3} sx={{ px: 3, pb: 5 }}>
     
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: "#1E1E1E", 
                    p: 3, 
                    borderRadius: 2,
                    height: "100%"
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" color="white">About</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#ccc", mb: 3, textAlign: "justify" }}>
                    {developer.bio || 
                      "Passionate developer with expertise in React, Node.js, and cloud technologies. Focused on creating clean, scalable solutions for complex problems. Always eager to learn new technologies and collaborate on innovative projects."}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "white", textAlign: "left" }}>Skills</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {skills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill}
                        icon={<Code />}
                        sx={{ 
                          bgcolor: "rgba(156, 39, 176, 0.1)", 
                          color: "#ce93d8",
                          '& .MuiChip-icon': { color: "#ce93d8" }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
           
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
          
                  <Grid item xs={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        p: 2, 
                        borderRadius: 2,
                        textAlign: "center"
                      }}
                    >
                      <Star sx={{ color: "#9c27b0", mb: 1, fontSize: 36 }} />
                      <Typography variant="h5" sx={{ fontWeight: 500, color: "white" }}>
                        {developer.projectCount || 12}
                      </Typography>
                      <Typography variant="body2" color="white">Projects</Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        p: 2, 
                        borderRadius: 2,
                        textAlign: "center"
                      }}
                    >
                      <Language sx={{ color: "#9c27b0", mb: 1, fontSize: 36 }} />
                      <Typography variant="h5" sx={{ fontWeight: 500, color: "white" }}>
                        {developer.experienceYears || 5}
                      </Typography>
                      <Typography variant="body2" color="white">Years Exp.</Typography>
                    </Paper>
                  </Grid>
                  
                  
                  <Grid item xs={12}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        p: 3, 
                        borderRadius: 2,
                        mt: 1
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, color: "white" }}> <ConnectWithoutContactIcon sx={{verticalAlign: "text-bottom", color: "#9c27b0"}} /> {user.user?.id === developer.id ? "Your Work" : "Contact"}</Typography>
                      
                      { user.user?.id !== developer.id && user.role !== "ADMIN" && (
                              <Button 
                              variant="contained" 
                              fullWidth 
                              sx={{ 
                                bgcolor: "#9c27b0", 
                                '&:hover': { bgcolor: "#7b1fa2" } 
                              }}
                              onClick={() => handleMessageDeveloper()}
                            >
                              Message Developer
                            </Button>
                      )}

                      <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{ 
                          mt: 2, 
                          borderColor: "rgba(156, 39, 176, 0.5)", 
                          color: "#9c27b0",
                          '&:hover': { borderColor: "#9c27b0" } 
                        }}
                        onClick={() => setOpen(true)}
                      >
                        View Portfolio
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Typography variant="h6">Developer not found.</Typography>
          </Box>
        )}
      </Box>
      <Modal open={open} onClose={() => setOpen(false)} width="1000px" height="100%">
        <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "80%", bgcolor: '#222', color: 'white', boxShadow: 24, p: 3, borderRadius: 2, border: '1px solid #333', textAlign: 'center'}}>
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 10, right: 5, color: 'white' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={600} sx={{mt: 3, mb: 3}}>Developer Portfolio</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                Completed Projects
              </Typography>
              
              <Chip 
                label={projects.completed.length} 
                size="small" 
                sx={{ 
                  ml: 2, 
                  bgcolor: theme.palette.secondary.main,
                  color: 'white'
                }} 
              />
          </Box>
          <Divider sx={{bgcolor: 'rgba(255,255,255,0.1)', mt: 3, mb: 3}} />
          {projects.completed.length > 0 ? (
              <Box sx={{ '& .slick-dots li button:before': { color: theme.palette.secondary.main } }}>
                <Slider {...settings}>
                  {projects.completed.map((project) => (
                    <Box 
                      key={project.id} 
                      sx={{ p: 2, display: 'flex', justifyContent: 'center' }} 
                   
                    >
                      <BrowseProjectItem project={project} />
                    </Box>
                  ))}
                </Slider>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                <Typography variant="body1" color="white">They haven't completed any projects yet.</Typography>
              </Box>
            )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TerminalIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                  In Progress Projects
                </Typography>
                <Chip 
                  label={projects.inProgress.length} 
                  size="small" 
                  sx={{ 
                    ml: 2, 
                    bgcolor: theme.palette.secondary.main,
                    color: 'white'
                  }} 
                />
              </Box>
              
            </Box>
            
            <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.secondary.main, 0.2) }} />
            
            {projects.inProgress.length > 0 ? (
              <Box sx={{ '& .slick-dots li button:before': { color: theme.palette.secondary.main } }}>
                <Slider {...settings}>
                  {projects.inProgress.map((project) => (
                    <Box 
                      key={project.id} 
                      sx={{ p: 2, display: 'flex', justifyContent: 'center' }} 
                      
                    >
                      <BrowseProjectItem project={project} />
                    </Box>
                  ))}
                </Slider>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.secondary.main, 0.15), borderRadius: 2 }}>
                <Typography variant="body1" sx={{ mb: 2, color:"white" }}>They are not working on any projects at the moment.</Typography>
                
              </Box>
            )}
        </Box>
        

      </Modal>

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: '#222', 
          color: 'white', 
          p: 3, 
          borderRadius: 2, 
          border: '1px solid #333', 
          width: '50%' 
        }}
      >
        <IconButton 
          onClick={handleCloseEditModal} 
          sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography variant="h4" fontWeight={600} sx={{ mt: 3, mb: 3, textAlign: "center" }}>
          Edit Profile
        </Typography>

        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '& .MuiInputLabel-root': { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '& .MuiInputLabel-root': { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2, bgcolor: "#333", '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '& .MuiInputLabel-root': { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          
        />

        <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: 'white' }} />
        <Button onClick={handleImageUpload} variant="contained" color="primary" sx={{ mt: 1, mb: 1 }}>
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Image'}
        </Button>

        <Button 
          variant="contained" 
          sx={{ bgcolor: '#9c27b0', '&:hover': { bgcolor: '#7b1fa2' } }} 
          onClick={handleUpdateProfile}
          fullWidth
        >
          Save Changes
        </Button>
      </Box>
    </Modal>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} >
          <Box sx={{ bgcolor: '#222', color: 'white' }}>

              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                  {user.user.id == id ? (<Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>) : (<Typography>Are you sure you want to delete this developer's account? This action cannot be undone.</Typography>)}
              </DialogContent>
              <DialogActions>
                  <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                      Cancel
                  </Button>
                  <Button onClick={() => handleDeleteProfile()} color="error">
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
};

export default DevProfilePage;