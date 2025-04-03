import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper, IconButton, Avatar } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const EditClientProfileModal = ({ open, onClose, client, onSubmit }) => {
    const [firstName, setFirstName] = useState(client?.firstName || "");
    const [lastName, setLastName] = useState(client?.lastName || "");
    const [email, setEmail] = useState(client?.email || "");
    const [image, setImage] = useState(client?.imageUrl || "");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (client) {
            setFirstName(client.firstName || "");
            setLastName(client.lastName || "");
            setEmail(client.email || "");
            setImage(client.imageUrl || "");
        }
    }, [client, open]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_URL, formData);
            setImage(response.data.secure_url);
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = () => {
        onSubmit({ firstName, lastName, email, imageUrl: image });
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

              
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Avatar src={image} sx={{ width: 100, height: 100 }} />
                    </Box>

                    <Button variant="contained" component="label" disabled={uploading} sx={{ mb: 2 }}>
                        {uploading ? "Uploading..." : "Upload New Image"}
                        <input type="file" hidden onChange={handleImageUpload} />
                    </Button>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                style: { color: 'white', backgroundColor: '#333', borderRadius: '8px' },
                            }}
                            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                        />
                        <TextField
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                style: { color: 'white', backgroundColor: '#333', borderRadius: '8px' },
                            }}
                            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                        />
                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                style: { color: 'white', backgroundColor: '#333', borderRadius: '8px' },
                            }}
                            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
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
