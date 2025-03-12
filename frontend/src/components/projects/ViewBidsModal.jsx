import React, { useState, useEffect } from 'react';
import { fetchBidsForProject, hireDeveloper } from '../../services/ProjectService';
import { getDeveloperById } from '../../services/AuthenicationService';
import { Box, Typography, Modal, IconButton, Divider, CircularProgress, Button, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';

const ViewBidsModal = ({ open, onClose, projectId, onDeveloperHired }) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState(null); 
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [devLoading, setDevLoading] = useState(false);
    const [hiredDeveloperId, setHiredDeveloperId] = useState(null);

    useEffect(() => {
        if (!open) return; 
        const fetchBids = async () => {
            try {
                const data = await fetchBidsForProject(projectId);
                setBids(data);
            } catch (error) {
                console.error("Error fetching bids:", error);
            }
            setLoading(false);
        };

        fetchBids();
    }, [open, projectId]);

    const handleViewDeveloper = async (developerId) => {
        setDevLoading(true);
        try {
            const devData = await getDeveloperById(developerId);
            setSelectedDeveloper(devData);
        } catch (error) {
            console.error("Error fetching developer details:", error);
        }
        setDevLoading(false);
    };

    const handleHireDeveloper = async (bidId) => {
        try {
            await hireDeveloper(projectId, bidId);
            setHiredDeveloperId(bidId);
            onDeveloperHired();
        } catch (error) {
            console.error("Error hiring developer:", error);
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box 
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: '#222', color: 'white',
                        boxShadow: 24, p: 3, borderRadius: 2,
                        overflowY: 'auto', maxHeight: '80vh'
                    }}
                >
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" textAlign="center" gutterBottom>
                        Bids for Project
                    </Typography>

                    {loading ? (
                        <CircularProgress color="secondary" sx={{ display: 'block', mx: 'auto', mt: 2 }} />
                    ) : bids.length === 0 ? (
                        <Typography textAlign="center" sx={{ mt: 2 }}>No bids yet.</Typography>
                    ) : (
                        <Box>
                            {bids.map((bid, index) => (
                                <Box key={bid.id} sx={{ p: 1 }}>
                                    <Typography variant="body1">
                                        💰 Amount: <strong>{bid.amount} Coins</strong>
                                    </Typography>

                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: '#00bcd4', cursor: 'pointer', mt: 1 }}
                                        onClick={() => setSelectedProposal(bid.proposal)}
                                    >
                                        📝 View Proposal
                                    </Typography>

                                    <Typography 
                                        variant="body2" 
                                        sx={{ mt: 1, color: '#00bcd4', cursor: 'pointer' }}
                                        onClick={() => handleViewDeveloper(bid.developerId)}
                                    >
                                        👨‍💻 View Developer Profile
                                    </Typography>

                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        sx={{ mt: 2, mx: 'auto', display: 'block' }} 
                                        onClick={() => handleHireDeveloper(bid.id)}
                                        disabled={!!hiredDeveloperId}
                                    >
                                        {hiredDeveloperId === bid.developerId ? "Developer Hired" : "Select Developer"}
                                    </Button>

                                    {index < bids.length - 1 && <Divider sx={{ my: 2, bgcolor: "gray" }} />}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Modal>

            <Modal open={!!selectedProposal} onClose={() => setSelectedProposal(null)}>
                <Box 
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350, bgcolor: '#222', color: 'white',
                        boxShadow: 24, p: 3, borderRadius: 2,
                        overflowY: 'auto', maxHeight: '80vh'
                    }}
                >
                    <IconButton onClick={() => setSelectedProposal(null)} sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" textAlign="center" gutterBottom>
                        Proposal Details
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {selectedProposal}
                    </Typography>
                </Box>
            </Modal>

            <Modal open={!!selectedDeveloper} onClose={() => setSelectedDeveloper(null)}>
                <Box 
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350, bgcolor: '#222', color: 'white',
                        boxShadow: 24, p: 3, borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <IconButton onClick={() => setSelectedDeveloper(null)} sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>

                    {devLoading ? (
                        <CircularProgress color="secondary" sx={{ mt: 3 }} />
                    ) : selectedDeveloper ? (
                        <>
                            <Avatar 
                                sx={{ width: 80, height: 80, margin: "auto", bgcolor: "gray" }} 
                                src="/placeholder-profile.png" 
                                alt={`${selectedDeveloper.firstName} ${selectedDeveloper.lastName}`} 
                            />

                            <Typography variant="h5" sx={{ mt: 2 }}>{selectedDeveloper.firstName} {selectedDeveloper.lastName}</Typography>
                            <Typography variant="subtitle2" sx={{ color: "gray" }}>{selectedDeveloper.email}</Typography>

                            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
                                <IconButton sx={{ color: "white" }}><Facebook /></IconButton>
                                <IconButton sx={{ color: "white" }}><Twitter /></IconButton>
                                <IconButton sx={{ color: "white" }}><LinkedIn /></IconButton>
                                <IconButton sx={{ color: "white" }}><GitHub /></IconButton>
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body1">Developer not found.</Typography>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ViewBidsModal;
