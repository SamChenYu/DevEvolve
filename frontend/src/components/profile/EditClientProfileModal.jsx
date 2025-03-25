import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const EditClientProfileModal = ({ open, onClose, client, onSubmit }) => {
    const [firstName, setFirstName] = useState(client?.firstName);
    const [lastName, setLastName] = useState(client?.lastName);
    const [email, setEmail] = useState(client?.email);

    const handleSubmit = () => {
        onSubmit({ firstName, lastName, email });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4,
                        borderRadius: 3,
                        backgroundColor: '#222',
                        width: '40%',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            color: 'white',
                        }}
                    >
                        <ArrowBack />
                    </IconButton>

                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Edit Profile
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                style: {
                                    color: 'white',
                                    backgroundColor: '#333',
                                    borderRadius: '8px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'rgba(255,255,255,0.7)' },
                            }}
                        />
                        <TextField
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                style: {
                                    color: 'white',
                                    backgroundColor: '#333',
                                    borderRadius: '8px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'rgba(255,255,255,0.7)' },
                            }}
                        />
                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                style: {
                                    color: 'white',
                                    backgroundColor: '#333',
                                    borderRadius: '8px',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'rgba(255,255,255,0.7)' },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            fullWidth
                            sx={{
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                py: 1.2,
                                fontSize: '1rem',
                                mt: 2,
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
};

export default EditClientProfileModal;
