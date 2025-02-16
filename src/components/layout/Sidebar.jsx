import React from 'react'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'

const drawerWidth = 240;
const Sidebar = ({menuItems}) => {
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
          <Typography variant="h6" fontWeight={700} color="white">Client Dashboard</Typography>
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