import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {Button, TextField, Typography, Container, Box, Paper, Toolbar, AppBar, Fade} from "@mui/material";
import { login } from "../../services/AuthenicationService";
import { UserContext } from "../../context/UserContext";
import { getUserFromToken } from "../../services/AuthenicationService";
import CodeIcon from "@mui/icons-material/Code";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const user = await login(formData);
            const { token } = user; 
            console.log("User in login:", user);

            
            document.cookie = `access_token=${token}; path=/; Secure`;
            console.log(document.cookie);

            
            const fullUser = await getUserFromToken();
            setUser(fullUser);
            console.log("User in login:", fullUser);

            
            if (fullUser.role === "DEVELOPER") {
                navigate("/developer-dashboard");
            } else if (fullUser.role === "CLIENT") {
                navigate("/client-dashboard");
            } else if (fullUser.role === "ADMIN") {
                navigate("/admin-dashboard");
            }
        } catch (error) {
            alert("Invalid credentials or session expired. Please try again.");
        }
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
                bgcolor: 'black', 
                color: 'white',
                minInlineSize: "100vw"
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
                  onClick={() => navigate("/client-registration")}
                  sx={{ borderRadius: '8px' }}
                >
                  Register
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
                    width: "50%",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.3)"
                }}
            >
                <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: 'white', pb: 2 }}>
                  Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        variant="filled"
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        variant="filled"
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
                        Login
                    </Button>
                </Box>
            </Paper>
          </Fade>
        </Container>
    );

}

export default Login;