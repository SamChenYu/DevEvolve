import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';
import { clientRegistration } from '../../services/AuthenicationService';

const ClientRegistration = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await clientRegistration(formData);
            console.log(response);
            alert('Client registered successfully');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    }

  return (
    <Container 
      maxWidth="lg"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        minWidth: '100vw', 
        bgcolor: 'black', 
        color: 'white'
      }}
    >
      <Paper 
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 3,
          backgroundColor: "#222",
          width: "50%",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.3)"
        }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: 'white' }}>
          Client Registration
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField 
            name="firstName" 
            label="First Name" 
            value={formData.firstName} 
            onChange={handleChange} 
            fullWidth 
            variant="outlined"
            InputProps={{ 
              style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } 
            }}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          />
          <TextField 
            name="lastName" 
            label="Last Name" 
            value={formData.lastName} 
            onChange={handleChange} 
            fullWidth 
            variant="outlined"
            InputProps={{ 
              style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } 
            }}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          />
          <TextField 
            name="email" 
            label="Email" 
            type="email"
            value={formData.email} 
            onChange={handleChange} 
            fullWidth 
            variant="outlined"
            InputProps={{ 
              style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } 
            }}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          />
          <TextField 
            name="password" 
            label="Password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            fullWidth 
            variant="outlined"
            InputProps={{ 
              style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } 
            }}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary" 
            fullWidth
            sx={{ 
              borderRadius: "8px", 
              fontWeight: "bold", 
              py: 1.2,
              fontSize: "1rem",
              mt: 2
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ClientRegistration;
