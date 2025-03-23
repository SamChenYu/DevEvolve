import React, { useEffect, useState, useContext, use } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import { developerBids, modifyBid, cancelBid, minBidLevel } from '../../services/ProjectService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CreateIcon from '@mui/icons-material/Create';
import EditBidModal from './EditBidModal';

const BidList = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [minBid, setMinBid] = useState(0);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN"))) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  useEffect(() => {
    if (user?.user?.id) {
      developerBids(user.user.id)
        .then((data) => {
          setBids(data);
          setIsLoading(false);
          console.log(data);
        })
        .catch((error) => console.error('Error fetching bids:', error));
    }
  }, [user]);

  useEffect(() => {
    if (user?.user?.level) {
      minBidLevel(user.user.level)
        .then((minAmount) => setMinBid(minAmount))
        .catch((error) => console.error('Error fetching min bid:', error));
    }
  }, [user]);

  if (loading || isLoading) {
    return <Typography variant="h4" sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Typography>;
  }

  const handleEditBid = (bid) => {
    setSelectedBid(bid);
    setEditModalOpen(true);
  };

  const handleUpdateBid = async (updatedBid) => {
    try {
      await modifyBid(selectedBid.id, updatedBid);
     
      const updatedBids = await developerBids(user.user.id);
      setBids(updatedBids);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating bid:", error);
    }
  };

  const handleCancelBid = async (bidId) => {
    try {
      await cancelBid(bidId);
      const updatedBids = await developerBids(user.user.id);
      setBids(updatedBids);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error canceling bid:", error);
    }
  };

  const acceptedBids = bids.filter((bid) => bid.status === "ACCEPTED");
  const pendingBids = bids.filter((bid) => bid.status !== "ACCEPTED");

  return (
    <Box display="flex" color="white" bgcolor="black" minHeight="100vh">
     
      <Sidebar />

     
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Your Bids
        </Typography>

        {bids.length === 0 ? (
          <Typography variant="h6">You have not placed any bids yet.</Typography>
        ) : (
          <>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:"white"}} />} sx={{ bgcolor: "#222", color: "white" }}>
                <Typography variant="h6">Accepted Bids</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: "#333" }}>
                {acceptedBids.length === 0 ? (
                  <Typography variant="body1" sx={{ color: "white" }}>No accepted bids yet.</Typography>
                ) : (
                  <List>
                    {acceptedBids.map((bid) => (
                      <Card key={bid.id} sx={{ bgcolor: "#444", color: "white", mb: 2, borderRadius: "10px", boxShadow: 3, transition: "transform 0.3s ease, background-color 0.3 ease", "&:hover": {transform: "scale(1.02)", backgroundColor: "#555"} }} onClick={() => navigate(`/project-details/${bid.projectId}`)}>
                        <CardContent>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                  {`Bid Amount: ${bid.amount} coins`}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" sx={{ color: "lightgray", fontSize: "0.9rem" }}>
                                  {`Proposal: ${bid.proposal}`}
                                </Typography>
                              }
                            />
                            
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Accepted"
                              color="success"
                              sx={{ fontWeight: "bold" }}
                            />
                          </ListItem>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:"white"}} />} sx={{ bgcolor: "#222", color: "white" }}>
                <Typography variant="h6">Pending / Rejected Bids</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: "#333" }}>
                {pendingBids.length === 0 ? (
                  <Typography variant="body1" sx={{ color: "gray" }}>No pending or rejected bids.</Typography>
                ) : (
                  <List>
                    {pendingBids.map((bid) => (
                      <Card key={bid.id} sx={{ bgcolor: "#444", color: "white", mb: 2, borderRadius: "10px", boxShadow: 3, transition: "transform 3s ease, background-color 3 ease", "&:hover": {transform: "scale(1.01)", backgroundColor: "#555"} }} onClick={() => navigate(`/project-details/${bid.projectId}`)}>
                        <CardContent>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                  {`Bid Amount: ${bid.amount} coins`}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" sx={{ color: "lightgray", fontSize: "0.9rem" }}>
                                  {`Proposal: ${bid.proposal}`}
                                </Typography>
                              }
                            />

                            <Chip
                              icon={bid.status === "PENDING" ? <HourglassEmptyIcon/> : <CancelIcon />}
                              label={bid.status === "PENDING" ? "Pending" : "Rejected"}
                              color={bid.status === "PENDING" ? "warning" : "error"}
                              sx={{ fontWeight: "bold", mr: 1 }}
                            />

                            {bid.status === "PENDING" && (
                              <>
                                <Chip 
                                  icon={<CreateIcon />}
                                  label="Edit Bid"
                                  color="primary"
                                  sx={{ fontWeight: "bold", mr: 1, '&:hover': {backgroundColor: "blue"}, cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditBid(bid);
                                  }}
                                />
                                <Chip
                                  icon={<CancelIcon />}
                                  label="Cancel Bid"
                                  color="error"
                                  sx={{ fontWeight: "bold", mr: 1, '&:hover': {backgroundColor: "red"}, cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBid(bid);
                                    setDeleteModalOpen(true);
                                  }}
                                />
                              </>
                              
                            )}
                            
                            
                          </ListItem>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Box>
      {selectedBid && (
        <EditBidModal 
          open={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          bid={selectedBid} 
          onSubmit={handleUpdateBid} 
          minBid={minBid}
        />
      )}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} >
        <Box sx={{ bgcolor: '#222', color: 'white' }}>

            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                {user.role !== "ADMIN" ? (<Typography>Are you sure you want to cancel your bid? This action cannot be undone.</Typography>) : (<Typography>Are you sure you want to cancel this developer's bid? This action cannot be undone.</Typography>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleCancelBid(selectedBid?.id)} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BidList;
