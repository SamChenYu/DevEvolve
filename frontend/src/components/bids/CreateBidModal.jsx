import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Modal, Paper, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { placeBid } from "../../services/ProjectService";
import { minBidLevel } from "../../services/ProjectService";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/en-gb'; 
import 'dayjs/plugin/timezone';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

const CreateBidModal = ({ open, handleClose, developerId, projectId, developerLevel }) => {
    const [formData, setFormData] = useState({ amount: "", proposal: "", bidDate: dayjs().tz('Europe/London') });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [minBid, setMinBid] = useState(0);

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
                    setError("Failed to fetch minimum bid.");
                });
        }
    }, [open, developerLevel]);

    const handleDateChange = (newValue) => {
        setFormData({ ...formData, bidDate: newValue });
    };

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

        const currentTime = dayjs().tz('Europe/London');

        if (!formData.proposal.trim()) {
            alert("Proposal cannot be empty.");
            setLoading(false);
            return;
        }
    
        if (!formData.bidDate) {
            alert("Please select a bid deadline.");
            setLoading(false);
            return;
        }
        
        if (dayjs(formData.bidDate).isBefore(currentTime)) {
            alert("Selected bid date/time has already passed. Please choose a future time. Reopen the modal to select a new date.");
            setLoading(false);
            return;
        }

        try {
            const bidData = {
                amount: parseFloat(formData.amount), 
                proposal: formData.proposal,
                bidDate: dayjs(formData.bidDate).tz('Europe/London').local().format('YYYY-MM-DDTHH:mm:ss'),
            };

            await placeBid(developerId, projectId, bidData);
            alert("Bid placed successfully!");
            handleClose(); 
            window.location.reload();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-GB">
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
                            <DateTimePicker
                                label="Proposed Deadline for Finishing the Project"
                                value={formData.bidDate}
                                onChange={handleDateChange}
                                minDateTime={dayjs().tz('Europe/London')}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                        InputProps: {
                                            style: { 
                                                color: "white", 
                                                backgroundColor: "#333", 
                                                borderRadius: "8px" 
                                            }
                                        },
                                        InputLabelProps: { style: { color: "rgba(255,255,255,0.7)" } },
                                        sx: {
                                            "& .MuiSvgIcon-root": {
                                                color: "white",
                                            },
                                        },
                                    },
                                }}
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
        </LocalizationProvider>
    );
};

export default CreateBidModal;
