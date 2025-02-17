import React from "react";
import { Card, CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const placeholderThumbnail = "https://images.squarespace-cdn.com/content/v1/649087af1b2b0e356cbd5516/1687193634202-J7IC7003UGR4EF0T0E3V/blank-thumbnail.jpg";

const ProjectItem = ({ project}) => {
  return (
    <Card sx={{ minWidth: 275, bgcolor: "#1e1e1e", color: "white", borderRadius: 2, m: 1 }}>
      <CardContent>
        <Box sx={{ width: "100%", height: 200, mb: 2 }}>
          <img
            src={placeholderThumbnail}
            alt="Project Thumbnail"
            style={{
              width: "100%", // makes it fill the container width
              height: "100%", // makes the image fill the height
              objectFit: "cover", // ensures the image covers the entire area without distorting
              borderRadius: "8px", // optional: to give rounded corners to the image
            }}
          />
        </Box>
        
          
          
        <Typography variant="h6" gutterBottom>
            {project.title}
        </Typography>
        <Typography variant="body2" gutterBottom>
            {project.description}
        </Typography>
          
       

        
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Chip
                label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MonetizationOnIcon sx={{ color: '#FFD700', mr: 1 }} />
                    <Typography variant="body2">{`Cost: ${project.cost}`}</Typography>
                </Box>
                }
                color="primary"
            />
            <Chip
            label={project.completed ? "✅ Completed" : "🕒 In Progress, Finding a Developer..."}
            color={project.completed ? "success" : "warning"}
            />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectItem;
