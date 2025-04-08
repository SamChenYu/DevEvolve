import React, { useState, useEffect } from 'react';
import { fetchBidsForProject, hireDeveloper, modifyBid, minBidLevel, cancelBid } from '../../services/ProjectService';
import { getDeveloperById } from '../../services/AuthenicationService';
import { Box, Typography, Modal, IconButton, Divider, CircularProgress, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';
import EditBidModal from '../bids/EditBidModal';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


const ViewBidsModal = ({ user, open, onClose, projectId, onDeveloperHired }) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState(null); 
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [devLoading, setDevLoading] = useState(false);
    const [hiredDeveloperId, setHiredDeveloperId] = useState(null);
    const [editBidModal, setEditBidModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);
    const [minBid, setMinBid] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return; 
        const fetchBids = async () => {
            try {
                const data = await fetchBidsForProject(projectId);
                setBids(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching bids:", error);
            }
            setLoading(false);
        };

        fetchBids();
    }, [open, projectId]);

    const handleEditBid = async(bid) => {
        setSelectedBid(bid);
        const developer = await getDeveloperById(bid.developerId);
        const minLevelBid = await minBidLevel(developer.level);
        setMinBid(minLevelBid);
        setEditBidModal(true);
    };

    const handleDeleteBid = async (bidId) => {
        try {
            await cancelBid(bidId);
            const updatedBids = await fetchBidsForProject(projectId);
            setBids(updatedBids);
            setDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting bid:", error);
        }
    };

    const handleUpdateBid = async (updatedBid) => {
        try {
          await modifyBid(selectedBid.id, updatedBid);
         
          const updatedBids = await fetchBidsForProject(projectId);
          setBids(updatedBids);
          setEditBidModal(false);
        } catch (error) {
          console.error("Error updating bid:", error);
        }
    };

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
            window.location.reload();
        } catch (error) {
            console.error("Error hiring developer:", error);
        }
    };

    const sortedBids = [...bids].sort((a, b) => a.amount - b.amount);

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
                            {sortedBids.filter(bid => {
                                const nowLondon = dayjs().tz('Europe/London');
                                return dayjs(bid.bidDate).isAfter(nowLondon); 
                            }).map((bid, index) => (
                                <Box key={bid.id} sx={{ p: 1 }}>

                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {bid.developerName}
                                    </Typography>

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

                                    {user.role === "CLIENT" && (<Button 
                                        variant="contained" 
                                        color="secondary" 
                                        sx={{ mt: 2 }} 
                                        onClick={() => handleHireDeveloper(bid.id)}
                                        disabled={!!hiredDeveloperId}
                                    >
                                        {hiredDeveloperId === bid.developerId ? "Developer Hired" : "Select Developer"}
                                    </Button>)}

                                    {user.role === "ADMIN" && (
                                    <>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => handleEditBid(bid)}
                                    >
                                        Edit Bid
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ mt: 2, ml: 0.75 }}
                                        onClick={() => {
                                            setSelectedBid(bid);
                                            setDeleteModalOpen(true);
                                        }}
                                    >
                                        Delete Bid
                                    </Button>
                                    </>)}

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
                                src={ selectedDeveloper.imageUrl || "/placeholder-profile.png" }
                                alt={`${selectedDeveloper.firstName} ${selectedDeveloper.lastName}`} 
                            />

                            <Typography variant="h5" sx={{ mt: 2 }}>{selectedDeveloper.firstName} {selectedDeveloper.lastName}</Typography>
                            <Typography variant="subtitle2" sx={{ color: "gray" }}>{selectedDeveloper.email}</Typography>
                            <Typography variant="body2" sx={{ mt: 1, color: '#00bcd4', cursor: 'pointer' }} onClick={() => navigate(`/dev-profile/${selectedDeveloper.id}`)}>
                                View Profile
                            </Typography>

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
            {selectedBid && (
                <EditBidModal 
                    open={editBidModal} 
                    onClose={() => setEditBidModal(false)} 
                    bid={selectedBid}
                    onSubmit={handleUpdateBid}
                    minBid={minBid}
                />
            )}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} >
                <Box sx={{ bgcolor: '#222', color: 'white' }}>

                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this bid? This action cannot be undone.</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleDeleteBid(selectedBid.id)} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
};

export default ViewBidsModal;
