import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Box, Paper } from "@mui/material";
import { login } from "../../services/AuthenicationService";
import { UserContext } from "../../context/UserContext";
import { getUserFromToken } from "../../services/AuthenicationService";

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
            const { role, userId } = user; 
            //setUser(user); 

            const fullUser = await getUserFromToken();
            setUser(fullUser);
            console.log("User in login:", fullUser);

            if (role === "DEVELOPER") {
                navigate("/developer-dashboard", { state: { userRole: role } });
            } else if (role === "CLIENT") {
                navigate("/client-dashboard", { state: { userRole: role } });
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
                    Login
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
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );

}

export default Login;