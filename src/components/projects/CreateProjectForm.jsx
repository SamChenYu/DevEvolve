import React, { use, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Box, CssBaseline, Paper, Typography, TextField, Button } from '@mui/material';
import { PersonSearch as PersonSearchIcon, Create as CreateIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import Sidebar from '../layout/Sidebar';
import { createProject } from '../../services/ProjectService';
import { UserContext } from '../../context/UserContext';

const CreateProjectForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        repoLink: "",
      });
    const { user } = useContext(UserContext);
    localStorage.setItem("user", JSON.stringify(user));
    const navigate = useNavigate();
    const location = useLocation();
    const storedRole = location.state?.storedRole;
    
    useEffect(() => {
      if (!localStorage.getItem("user") || storedRole !== "CLIENT") {
          navigate("/login");
      }
    }, [user, navigate]);

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await createProject(user.id, formData);
          alert("Project Created Successfully!");
          navigate("/client-dashboard");
        } catch (error) {
          alert(error || "An error occurred. Please try again.");
        }
      };
    
      const menuItems = [
        { text: "Browse Developers", icon: <PersonSearchIcon />, onClick: () => navigate("/browse-developers") },
        { text: "Create Project", icon: <CreateIcon />, onClick: () => navigate("/create-project"), selected: true },
        { text: "Profile", icon: <AccountCircleIcon />, onClick: () => navigate("/profile") },
      ];
    
      return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
          <CssBaseline />
    
          <Sidebar menuItems={menuItems} />
    
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
        </Box>
      );
}

export default CreateProjectForm