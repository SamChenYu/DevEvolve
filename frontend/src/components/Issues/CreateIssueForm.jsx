import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Paper, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, useTheme } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import { createIssue } from '../../services/ProjectService';
import { UserContext } from '../../context/UserContext';

const issueTypes = [
  { value: 'CLIENT', label: 'Client' },
  { value: 'DEVELOPER', label: 'Developer' },
  { value: 'PROJECT', label: 'Project' },
];

const CreateIssueForm = () => {

    
    const { user, loading } = useContext(UserContext);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '', 
        userID: null,
        username: null,
    });

    useEffect(() => {
      console.log("user", user);

      if(user) {
        setFormData(prev => ({
            ...prev,
            userID: user.user.id,
            username: user.user.firstName + " " + user.user.lastName,
        }));
      }
      console.log("formData", formData);
    }, [user]);
    
    
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (!loading && (!user)) {
            navigate("/login");
        }
    }, [navigate, user, loading]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIssue(formData);
      alert("Issue created successfully!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error creating issue:", error);
      alert("An error occurred while creating the issue. Please try again.");
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: 'black', 
      color: 'white' 
    }}>
      <CssBaseline />
      <Sidebar />

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: '#222',
            width: '50%',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: 'white' }}>
            Report Issue
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >

            <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#333', borderRadius: '8px' }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Issue Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Issue Type"
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                }}
              >
                {issueTypes.map(issue => (
                  <MenuItem key={issue.value} value={issue.value}>
                    {issue.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="title"
              label="Issue Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ style: { color: 'white', backgroundColor: '#333', borderRadius: '8px' } }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
              InputProps={{ style: { color: 'white', backgroundColor: '#333', borderRadius: '8px' } }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />



            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                borderRadius: '8px',
                fontWeight: 'bold',
                py: 1.2,
                fontSize: '1rem',
                mt: 2,
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateIssueForm;
