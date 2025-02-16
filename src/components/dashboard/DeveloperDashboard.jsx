import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PriceChangeIcon from '@mui/icons-material/PriceChange';

const drawerWidth = 240;
const DeveloperDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

   
    if (!token || role !== "DEVELOPER") {
      navigate("/login"); 
    }
  }, [navigate]);

  const menuItems = [
    { text: "Browse Developers", icon: <PersonSearchIcon /> },
    { text: "Your Bids", icon: <PriceChangeIcon /> },
    { text: "Profile", icon: <AccountCircleIcon /> }
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#222",
            color: "white",
          },
        }}
      >
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="h6" fontWeight={700} color="white">Developer Dashboard</Typography>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={item.onClick}>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Welcome to the Developer Dashboard</Typography>
      </Box>
    </Box>
  );
};

export default DeveloperDashboard;