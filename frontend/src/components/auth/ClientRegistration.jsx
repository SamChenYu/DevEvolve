import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {Button, TextField, Fade, Typography, Container, Box, Paper, Toolbar, AppBar, Switch, Stack, Snackbar, Alert} from '@mui/material';
import { clientRegistration } from '../../services/AuthenicationService';
import CodeIcon from "@mui/icons-material/Code";

const ClientRegistration = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const changePage = e => {
    if (!e.target.checked) {
      navigate('/developer-registration');
    }
  }

  const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await clientRegistration(formData);
      console.log(response);
      setSuccessMessage("Registration successful. Redirecting to login page...");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Registration failed.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#800080',
          opacity: 1,
          border: 0,
          ...theme.applyStyles('dark', {
            backgroundColor: '#800080',
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#800080',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[600],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
          opacity: 0.3,
        }),
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
      }),
    },
  }));

    

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
      <AppBar
        position="fixed"
        sx={{
          background: "transparent",
          transition: "all 0.4s ease",
        }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "white",
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
          <CodeIcon /> DevEvolve
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
              sx={{ borderRadius: '8px' }}
            >
              Back to HomePage
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: '8px' }}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Fade in timeout={2000}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "#222",
            width: "37%",
            textAlign: "center",
            border: "1px solid black"
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: 'white' }}>
            Register as Client
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Stack direction="row" spacing={1} sx={{justifyContent: 'center', pb: 3 }}>
              <Typography sx = {{color: 'white'}}>Developer</Typography>
              {<IOSSwitch sx={{ m: 1 }} defaultChecked onChange={changePage} />}
              <Typography sx = {{color: 'white'}}>Client</Typography>
            </Stack>
            <TextField
              name="firstName"
              label = "First Name"
              value={formData.firstName || ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              color="white"
              InputProps={{ sx: { borderRadius: 5, } }}
              sx={{
                borderRadius: 5,
                backgroundColor: '#333',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={formData.lastName || ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              color="white"
              InputProps={{ sx: { borderRadius: 5 } }}
              sx={{
                borderRadius: 5,
                backgroundColor: '#333',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email || ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              color="white"
              InputProps={{ sx: { borderRadius: 5 } }}
              sx={{
                borderRadius: 5,
                backgroundColor: '#333',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password || ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              color="white"
              InputProps={{ sx: { borderRadius: 5 } }}
              sx={{
                borderRadius: 5,
                backgroundColor: '#333',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
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
      </Fade>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarSeverity === "success" ? successMessage : errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ClientRegistration;
