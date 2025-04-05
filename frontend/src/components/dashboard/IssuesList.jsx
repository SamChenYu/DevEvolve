import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Box, Typography, Chip, Divider, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, useTheme, CircularProgress, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getAllIssues, deleteIssue } from "../../services/ProjectService";
import RefreshIcon from "@mui/icons-material/Refresh";

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const navigate = useNavigate();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await getAllIssues();
      setIssues(data);
      console.log("Fetched issues:", data);
    } catch (err) {
      console.error("Error fetching issues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleResolve = async (issueId) => {
    try {
      await deleteIssue(issueId);
      setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
    } catch (err) {
      console.error("Error deleting issue", err);
    }
  };

  const handleOpen = (issue) => {
    setSelectedIssue(issue);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIssue(null);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "#222",
        backdropFilter: "blur(10px)",
        border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ color: "white", fontWeight: 600, flexGrow: 1 }}
        >
          Issues List
        </Typography>
        <IconButton onClick={fetchIssues} aria-label="refresh" sx={{ color: theme.palette.secondary.main }}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.secondary.main, 0.2) }} />
      {loading ? (
        <CircularProgress color="secondary" />
      ) : issues.length === 0 ? (
        <Typography sx={{ color: "#ffffff" }}>No issues to display.</Typography>
      ) : (
        <List>
          {issues.map((issue) => (
            <ListItem
              key={issue.id}
              sx={{
                mb: 1,
                bgcolor: "#333",
                borderRadius: 1,
                transition: "background-color 0.3s",
                "&:hover": {
                  bgcolor: "#444",
                },
              }}
              onClick={() => {
                handleOpen(issue);
              }
              }
            >
              <ListItemText
                primary={issue.title}
                secondary={issue.description}
                primaryTypographyProps={{ sx: { color: "#ffffff" } }}
                secondaryTypographyProps={{ sx: { color: alpha("#ffffff", 0.8) } }}
              />
              <ListItemSecondaryAction>
                <Chip
                  label="Resolve"
                  color="secondary"
                  onClick={() => handleResolve(issue.id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                    },
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth >
        
        {selectedIssue && (
          <>
            <DialogTitle sx={{ bgcolor: "#222", color: "#fff" }}>
              {selectedIssue.title}
            </DialogTitle>
             
            <DialogContent sx={{ bgcolor: "#222", color: "#fff" }}>

            <Typography
              variant="body1"
              mb={3}
              onClick={() => {
                
                if(selectedIssue.client) {
                  navigate(`/client-profile/${selectedIssue.userID}`);
                } else {
                  navigate(`/dev-profile/${selectedIssue.userID}`);
                }
                
                handleClose();
              }}
              sx={{ cursor: "pointer" }} // makes the whole line clickable
            >
              <strong>Submitted By:</strong>{" "}
              <Box component="span" sx={{ color: "primary", textDecoration: "underline" }}>
                {selectedIssue.username}
              </Box>
            </Typography>
              <Typography variant="body1" mb={3}>
                <strong>Issue Type:</strong> {selectedIssue.type}
              </Typography>
              <DialogContentText sx={{ mb: 2, color: alpha("#fff", 0.8) }}>
                <strong>Description: </strong>{selectedIssue.description}
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ bgcolor: "#222" }}>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
              <Button 
                onClick={() => {
                  handleResolve(selectedIssue.id);
                  handleClose();
                }}
                color="secondary"
                variant="contained"
              >
                Resolve Issue
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default IssuesList;
