import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, Paper, Snackbar, Alert } from '@mui/material';
import { developerRegistration } from '../../services/AuthenicationService';

const DeveloperRegistration = () => {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error")
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const {firstName, lastName, email, password} = formData;
        console.log('formdata', formData);

        if (!firstName || !lastName || !email || !password) {
            setSnackbarMessage('All fields are required');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid Email:', email);
            setSnackbarMessage('Please enter a valid email address');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return false;
        }

        if (password.length < 6) {
            console.log('Password Length:', password.length);
            setSnackbarMessage('Password must be at least 6 characters long');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return false;
        }

        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await developerRegistration(formData);
            console.log(response);
            setSnackbarMessage('Developer registered successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/login');
            }, 500);
        } catch (error) {
            console.error(error);
            setSnackbarMessage(error.message || 'An error occurred. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    
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
                    Developer Registration
                </Typography>
                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2 
                    }}
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
    }

export default DeveloperRegistration;