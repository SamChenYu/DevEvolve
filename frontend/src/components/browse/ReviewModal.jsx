import React from "react";
import { Modal, Box, Typography, Button, Rating } from "@mui/material";

const ReviewModal = ({ open, handleClose, feedback, rating }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="review-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#1E1E1E",
          boxShadow: 24,
          p: 4,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" id="review-modal" gutterBottom>
          Project Feedback
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Feedback:</strong> {feedback || "No feedback provided"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            <strong>Rating:</strong>
          </Typography>
          <Rating value={rating || 0} readOnly />
        </Box>

        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3, width: "100%" }}
          onClick={handleClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ReviewModal;
