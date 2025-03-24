import {useEffect, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/AuthenicationService';
import { UserContext } from '../../context/UserContext';
import { Snackbar, Alert } from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error")

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout(); 
        localStorage.clear(); 
        setUser(null); 
        navigate('/'); 
      } catch (error) {
        console.error("Logout failed:", error);
        setSnackbarMessage("Logout failed. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    handleLogout();
  }, [navigate, setUser]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  }

  return (
      <>
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
      </>
  )
};

export default Logout;
