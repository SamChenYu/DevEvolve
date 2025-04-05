import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'; 
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import ArchiveIcon from '@mui/icons-material/Archive'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import { useNavigate } from "react-router-dom";

const placeholderThumbnail = "https://images.squarespace-cdn.com/content/v1/649087af1b2b0e356cbd5516/1687193634202-J7IC7003UGR4EF0T0E3V/blank-thumbnail.jpg";

const statusLabels = {
  FINDING_DEVELOPER: { label: "Finding a Developer", icon: <HourglassBottomIcon />, color: "warning" },
  IN_PROGRESS: { label: "In Progress", icon: <RocketLaunchIcon />, color: "info" },
  COMPLETED: { label: "Completed", icon: <CheckCircleIcon />, color: "success" },
  ARCHIVED: { label: "Archived", icon: <ArchiveIcon />, color: "secondary" },
  LATE: { label: "Late", icon: <WarningIcon />, color: "error" }
};

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
            src={project.imageUrl?.trim() ? project.imageUrl : placeholderThumbnail}
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
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {statusLabels[project.status]?.icon}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {statusLabels[project.status]?.label || "Unknown Status"}
                </Typography>
              </Box>
            }
            color={statusLabels[project.status]?.color || "default"}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectItem;
