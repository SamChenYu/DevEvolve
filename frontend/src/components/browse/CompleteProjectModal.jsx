import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const CompleteProjectModal = ({ open, handleClose, handleSubmit }) => {
  const [report, setReport] = useState('');

  const handleComplete = () => {
    handleSubmit(report);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        bgcolor: '#1E1E1E', color: 'white', p: 4, borderRadius: 2, width: 400
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Submit Final Report</Typography>
        <TextField 
          fullWidth 
          multiline 
          rows={4} 
          variant="outlined" 
          label="Final Report" 
          value={report} 
          onChange={(e) => setReport(e.target.value)} 
          sx={{ bgcolor: 'white', borderRadius: 1, mb: 2 }}
        />
        <Button onClick={handleComplete} variant="contained" sx={{ mr: 1 }}>Submit</Button>
        <Button onClick={handleClose} variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>Cancel</Button>
      </Box>
    </Modal>
  );
};

export default CompleteProjectModal;
