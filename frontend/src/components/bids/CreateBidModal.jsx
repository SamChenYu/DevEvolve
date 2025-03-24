import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Modal, Paper, IconButton, Snackbar, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { placeBid } from "../../services/ProjectService";
import { minBidLevel } from "../../services/ProjectService";

const CreateBidModal = ({ open, handleClose, developerId, projectId, developerLevel }) => {
    const [formData, setFormData] = useState({ amount: "", proposal: "" });
    const [loading, setLoading] = useState(false);
    const [minBid, setMinBid] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    useEffect(() => {
        if (open && developerLevel) {
            setMinBid(null);
            minBidLevel(developerLevel)
                .then((minAmount) => {
                    setMinBid(minAmount);
                    setFormData((prev) => ({ ...prev, amount: minAmount }));
                })
                .catch((err) => {
                    console.error("Error fetching min bid:", err);
                    setSnackbarMessage("Failed to fetch minimum bid.");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                });
        }
    }, [open, developerLevel]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "amount") {
            const numericValue = parseFloat(value);
            if (numericValue < minBid) return; 
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const bidData = {
                amount: parseFloat(formData.amount), 
                proposal: formData.proposal,
            };

            await placeBid(developerId, projectId, bidData);
            setSnackbarMessage("Bid placed successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            handleClose(); 
            window.location.reload();
        } catch (err) {
            console.error("Error placing bid:", err);
            setSnackbarMessage(err.message || "Failed to plaice bid. PLease try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <>
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
                                    style: { color: "white", backgroundColor: "#333", borderRadius: "8px" }, inputProps: { min: minBid || 0 }, disabled: minBid === null,
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateBidModal;
