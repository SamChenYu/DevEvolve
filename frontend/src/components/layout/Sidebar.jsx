import React from 'react'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PriceChangeIcon from '@mui/icons-material/PriceChange';


const drawerWidth = 240;
const Sidebar = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  var menuItems = [];
  useEffect(() => {
      if (!loading && !user) {
        navigate("/login");
      }
    }, [navigate, user, loading]);
  
    if (loading) {
      return <Typography variant="h4">Loading...</Typography>;
    }
  
    if (!user) {
      return null; 
    }

    if (user.role === "CLIENT") {
      menuItems = [
        { text: "Browse Developers", icon: <PersonSearchIcon />, onClick: () => navigate("/browse-developers") },
        { text: "Create Project", icon: <CreateIcon />, onClick: () => navigate("/create-project") },
        { text: "Profile", icon: <AccountCircleIcon />, onClick: () => navigate("/profile") },
        { text: "Logout", icon: <ExitToAppIcon />, onClick: () => navigate("/logout") },
      ];
    }
    else if (user.role === "DEVELOPER") {
      menuItems = [
        { text: "Browse Projects", icon: <PersonSearchIcon />, onClick: () => navigate("/browse-projects") },
        { text: "Your Bids", icon: <PriceChangeIcon />, onClick: () => navigate("/your-bids") },
        { text: "Profile", icon: <AccountCircleIcon />, onClick: () => navigate("/profile") },
        { text: "Logout", icon: <ExitToAppIcon />, onClick: () => navigate("/logout") },
      ];
    }
  const homepage = () => {
    if (user.role === "CLIENT") {
      navigate("/client-dashboard");
    } else if (user.role === "DEVELOPER") {
      navigate("/developer-dashboard");
    }
  };

  return (
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
          <Typography sx={{display: "flex", alignItems: "center", paddingLeft: 4, cursor:'pointer'}} variant="h6" fontWeight={700} color="white" onClick={homepage}> <CodeIcon /> DevEvolve</Typography>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={item.onClick} sx={{
              color: 'white',
              marginBottom: '8px',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'purple', 
                transform: 'scale(1.05)',   
                transition: 'background-color 0.3s ease, transform 0.3s ease', 
              },
            }}>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
    </Drawer>
  )
}

export default Sidebar;