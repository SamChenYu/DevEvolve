import React from "react";
import { Card, CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useNavigate } from "react-router-dom";

const placeholderThumbnail = "https://images.squarespace-cdn.com/content/v1/649087af1b2b0e356cbd5516/1687193634202-J7IC7003UGR4EF0T0E3V/blank-thumbnail.jpg";


const ProjectItem = ({ project, clientId }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    
    navigate(`/projects/${clientId}/${project.id}`);
  };
  return (
    <Card sx={{ minWidth: 275, bgcolor: "#1e1e1e", color: "white", borderRadius: 2, m: 1 }} onClick={handleClick}>
      <CardContent>
        <Box sx={{ width: "100%", height: 200, mb: 2 }}>
          <img
            src={placeholderThumbnail}
            alt="Project Thumbnail"
            style={{
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              borderRadius: "8px", 
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
