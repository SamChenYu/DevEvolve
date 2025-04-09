import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/en-gb';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditBidModal = ({ open, onClose, bid, onSubmit, minBid }) => {
    const [formData, setFormData] = useState({
        amount: bid.amount,
        proposal: bid.proposal,
        bidDate: dayjs(bid.bidDate).tz('Europe/London'),
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        setFormData({
            amount: bid.amount,
            proposal: bid.proposal,
            bidDate: dayjs(bid.bidDate).tz('Europe/London'),
        });
    }, [bid, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "amount") {
            const numericValue = parseFloat(value);
            if (numericValue >= minBid || value === "") {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDateChange = (newValue) => {
        setFormData({ ...formData, bidDate: newValue });
    };

    const handleSubmit = async () => {
        const nowLondon = dayjs().tz('Europe/London');
    
        if (!formData.amount || parseFloat(formData.amount) < minBid) {
            setSnackbar({ open: true, message: `Amount must be at least £${minBid}`, severity: 'error' });
            return;
        }
    

        if (!formData.proposal || formData.proposal.trim() === "") {
            setSnackbar({ open: true, message: 'Proposal cannot be empty.', severity: 'error' });
            return;
        }

        const bidDate = dayjs(formData.bidDate).tz('Europe/London');
        if (!bidDate.isValid()) {
            setSnackbar({ open: true, message: 'Invalid date format. Please use a valid date and time.', severity: 'error' });
            return;
        }
    
        if (!formData.bidDate || formData.bidDate.isBefore(nowLondon)) {
            setSnackbar({ open: true, message: 'Please select a valid future date & time.', severity: 'error' });
            return;
        }
    
        setLoading(true);
    
        try {
            const updatedBid = {
                ...formData,
                bidDate: dayjs(formData.bidDate).tz('Europe/London').format('YYYY-MM-DDTHH:mm:ss'),
            };
    
            await onSubmit(updatedBid);
            setSnackbar({ open: true, message: 'Bid updated successfully!', severity: 'success' });
            onClose();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Something went wrong. Please try again.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-GB">
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
                                            style: { color: "white", backgroundColor: "#333", borderRadius: "8px" },
                                        },
                                        InputLabelProps: { style: { color: "rgba(255,255,255,0.7)" } },
                                        sx: { "& .MuiSvgIcon-root": { color: "white" } },
                                    },
                                }}
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
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled" width="150%">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default EditBidModal;
