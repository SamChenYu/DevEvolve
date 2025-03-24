import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, Chip, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import { developerBids } from '../../services/ProjectService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const BidList = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    if (!loading && (!user || user.role !== "DEVELOPER")) {
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
        .catch((error) => {
            console.error('Error fetching bids:', error);
            setSnackbarMessage("Failed to fetch bids. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            setIsLoading(false);
        });
    }
  }, [user]);

  const handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {
          return;
      }
      setOpenSnackbar(false);
  }

  if (loading || isLoading) {
    return <Typography variant="h4" sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Typography>;
  }

  const acceptedBids = bids.filter((bid) => bid.status === "ACCEPTED");
  const pendingBids = bids.filter((bid) => bid.status !== "ACCEPTED");

  return (
    <Box display="flex" color="white" bgcolor="black" minHeight="100vh">
     
      <Sidebar />

     
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
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
          </>
        )}
      </Box>
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
    </Box>
  );
};

export default BidList;
