import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper, IconButton, Alert, Snackbar } from '@mui/material';
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

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [formData, setFormData] = useState({
        amount: bid.amount,
        proposal: bid.proposal,
        bidDate: dayjs(bid.bidDate).tz('Europe/London'),
    });

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

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = () => {

        const nowLondon = dayjs().tz('Europe/London');

        if (!formData.bidDate || formData.bidDate.isBefore(nowLondon)) {
            setErrorMessage("Please select a valid future date & time for your bid deadline.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const updatedBid = {
            ...formData,
            bidDate: dayjs(formData.bidDate).tz('Europe/London').local().format('YYYY-MM-DDTHH:mm:ss'),
        };
        onSubmit(updatedBid);
        onClose();
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
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '150%' }}>
                    {snackbarSeverity === "success" ? successMessage : errorMessage}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default EditBidModal;
