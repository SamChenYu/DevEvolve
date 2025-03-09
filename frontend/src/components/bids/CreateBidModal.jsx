import React, { useState } from "react";
import { Button, TextField, Typography, Box, Modal, Paper, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreateBidModal = ({ open, handleClose, developerId, projectId }) => {
    const [formData, setFormData] = useState({ amount: "", proposal: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // call api here, need to make changes to project service and import
        // maybe add currency to modal or top right corner of dashboard
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box 
                sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    minHeight: "100vh",
                }}
            >
                <Paper 
                    elevation={6}
                    sx={{
                        padding: 4,
                        borderRadius: 3,
                        backgroundColor: "#222",
                        width: "40%",
                        textAlign: "center",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "white",
                        position: "relative",
                    }}
                >
                    <IconButton 
                        onClick={handleClose} 
                        sx={{ position: "absolute", top: 10, left: 10, color: "white" }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Place a Bid
                    </Typography>

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField 
                            name="amount" 
                            label="Bid Amount" 
                            type="number" 
                            value={formData.amount} 
                            onChange={handleChange} 
                            fullWidth 
                            variant="outlined"
                            InputProps={{ 
                                style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } 
                            }}
                            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                        />
                        <TextField 
                            name="proposal" 
                            label="Proposal" 
                            multiline
                            rows={4}
                            value={formData.proposal} 
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
                            disabled={loading}
                            sx={{ 
                                borderRadius: "8px", 
                                fontWeight: "bold", 
                                py: 1.2,
                                fontSize: "1rem",
                                mt: 2
                            }}
                        >
                            {loading ? "Submitting..." : "Submit Bid"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
};

export default CreateBidModal;
