import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Box, CssBaseline, Paper, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import { createProject } from '../../services/ProjectService';
import { UserContext } from '../../context/UserContext';


const CreateProjectForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        repoLink: "",
      });
      const { user, loading } = useContext(UserContext);
      const [openSnackbar, setOpenSnackbar] = useState(false);
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [snackbarSeverity, setSnackbarSeverity] = useState("error");
      const navigate = useNavigate();
      
      
      useEffect(() => {
        if (loading) return;  
    
        if (!user || user.role !== "CLIENT") {
          navigate("/login");
        }
      }, [user, loading, navigate]);
    

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setSnackbarMessage("Project title is required");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!formData.description.trim()) {
            setSnackbarMessage("Project description is required");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        try {
          await createProject(user.user.id, formData);
          setSnackbarMessage("Project Created Successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          setTimeout(() => {
              navigate("/client-dashboard");
              window.location.reload();
          }, 1500);
        } catch (error) {
            console.error("Project creation error:", error);
            setSnackbarMessage(error.message || "Failed to create project. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
      };

      const handleCloseSnackbar = (event, reason) => {
          if (reason === 'clickaway') {
              return;
          }
          setOpenSnackbar(false);
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
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
      );
}

export default CreateProjectForm