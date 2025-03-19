import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AdminContext} from "../../context/AdminContext";
import { Box, CssBaseline, Typography } from '@mui/material';
import Sidebar from '../layout/Sidebar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { admin, loading } = useContext(AdminContext);

    useEffect(() => {
        if (!loading && !admin) {
            navigate("/login");
        }
    }, [navigate, admin, loading]);

    if (loading) {
        return <Typography variant="h4">Loading...</Typography>;
    }

    if (!admin) {
        return null;
    }

    return(
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
            <CssBaseline />

            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4">Welcome to the Admin Dashboard</Typography>
            </Box>
        </Box>
    );
}

export default AdminDashboard;