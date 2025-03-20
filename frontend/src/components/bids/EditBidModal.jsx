import React from 'react'
import { Modal, Box, Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import { useState } from 'react';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditBidModal = ({ open, onClose, bid, onSubmit}) => {
    const [amount, setAmount] = useState(bid.amount);
    const [proposal, setProposal] = useState(bid.proposal);

    const handleSubmit = () => {
        onSubmit({amount, proposal});
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

                    <Box 
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{ 
                                style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } 
                            }}
                            InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                        />
                        <TextField
                            label="Proposal"
                            value={proposal}
                            onChange={(e) => setProposal(e.target.value)}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            InputProps={{ 
                                style: { color: "white", backgroundColor: "#333", borderRadius: "8px" } 
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
}

export default EditBidModal
