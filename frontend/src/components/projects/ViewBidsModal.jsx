import React, { useState, useEffect } from 'react';
import { fetchBidsForProject } from '../../services/ProjectService';
import { Box, Typography, Modal, IconButton, Divider, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const BidsModal = ({ open, onClose, projectId }) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState(null); 

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

    return (
        <>
            
            <Modal open={open} onClose={onClose}>
                <Box 
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: '#222', color: 'white',
                        boxShadow: 24, p: 3, borderRadius: 2
                    }}
                >
                    
                    <IconButton 
                        onClick={onClose} 
                        sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
                    >
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
                                <Box key={bid.id} sx={{ p: 2 }}>
                                    <Typography variant="body1">
                                        💰 Amount: <strong>{bid.amount} Coins</strong>
                                    </Typography>

                                    
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: '#00bcd4', cursor: 'pointer', mt: 1 }}
                                        onClick={() => setSelectedProposal(bid.proposal)}
                                    >
                                        <span style={{ marginRight: '4px' }}>📜</span> 
                                        <span >View Proposal</span>
                                    </Typography>
                                    
                                    
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        👨‍💻 <Link to={`/developer/${bid.developerId}`} style={{ color: '#00bcd4', textDecoration: 'none' }}>
                                            View Developer Profile
                                        </Link>
                                    </Typography>

                                
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
                    
                    <IconButton 
                        onClick={() => setSelectedProposal(null)} 
                        sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
                    >
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
        </>
    );
};

export default BidsModal;
