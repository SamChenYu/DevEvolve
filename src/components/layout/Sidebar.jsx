import React from 'react'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const Sidebar = ({menuItems}) => {
  const navigate = useNavigate();
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
          <Typography sx={{display: "flex", alignItems: "center", paddingLeft: 4}} variant="h6" fontWeight={700} color="white" onClick={() => {navigate("/")}}> <CodeIcon /> DevEvolve</Typography>
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
  )
}

export default Sidebar;