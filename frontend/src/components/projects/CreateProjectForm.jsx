import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import {Box, CssBaseline, Paper, Typography, TextField, Button, CircularProgress, Alert, Snackbar} from '@mui/material';
import Sidebar from '../layout/Sidebar';
import { createProject } from '../../services/ProjectService';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;


const CreateProjectForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        repoLink: "",
        imageUrl: "",
      });
      const [image, setImage] = useState(null);
      const [uploading, setUploading] = useState(false);
      const { user, loading } = useContext(UserContext);
      const navigate = useNavigate();
      const [errorMessage, setErrorMessage] = useState("");
      const [successMessage, setSuccessMessage] = useState("");
      const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [snackbarSeverity, setSnackbarSeverity] = useState("success");
      
      
      useEffect(() => {
        if (loading) return;  
    
        if (!user || user.role !== "CLIENT") {
          navigate("/login");
        }
      }, [user, loading, navigate]);

      const handleSnackbarClose = () => {
          setSnackbarOpen(false);
      };

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await createProject(user.user.id, formData);
          setSuccessMessage("Project created successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate('/client-dashboard');
            window.location.reload();
          }, 1000);
        } catch (error) {
          setErrorMessage("An error occurred. Please try again.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      };
    
    
      return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
          <CssBaseline />
    
          <Sidebar />
    
          <Box component="main" sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper
              elevation={6}
              sx={{
                padding: 4,
                borderRadius: 3,
                backgroundColor: "#222",
                width: "50%",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.3)",
               
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: "white" }}>
                Create Project
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  name="title"
                  label="Project Title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{ style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } }}
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{ style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } }}
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  name="repoLink"
                  label="Repository Link (GitHub, GitLab, etc.)"
                  value={formData.repoLink}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{ style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } }}
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                />

                <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: 'white' }} />
                <Button onClick={handleImageUpload} variant="contained" color="primary" sx={{ mt: 1 }}>
                    {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Image'}
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ borderRadius: "8px", fontWeight: "bold", py: 1.2, fontSize: "1rem", mt: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </Paper>
          </Box>
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

export default CreateProjectForm