import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditBidModal = ({ open, onClose, bid, onSubmit, minBid }) => {
    const [formData, setFormData] = useState({
        amount: bid.amount,
        proposal: bid.proposal,
    });

    useEffect(() => {
        setFormData({
            amount: bid.amount,
            proposal: bid.proposal,
        });
    }, [bid, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "amount") {
            const numericValue = parseFloat(value);
            console.log(numericValue, minBid);
     
            if (numericValue >= minBid || value === "") {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
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
                        onClick={onClose}
                        sx={{ position: "absolute", top: 10, left: 10, color: "white" }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Edit Bid
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            
                        <TextField
                            label="Amount"
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                style: { color: "white", backgroundColor: "#333", borderRadius: "8px" },
                                inputProps: { min: minBid || 0 }, 
                            }}
                            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                        />

                       
                        <TextField
                            label="Proposal"
                            name="proposal"
                            value={formData.proposal}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            InputProps={{
                                style: { color: "white", backgroundColor: "#333", borderRadius: "8px" },
                            }}
                            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                        />

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            fullWidth
                            sx={{
                                borderRadius: "8px",
                                fontWeight: "bold",
                                py: 1.2,
                                fontSize: "1rem",
                                mt: 2
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
};

export default EditBidModal;
