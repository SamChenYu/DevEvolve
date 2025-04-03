import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

const BrowseProjectItem = ({ project }) => {
  return (
    <Card 
      sx={{ 
        backgroundColor: '#1E1E1E', 
        color: 'white', 
        cursor: 'pointer', 
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 4px 20px rgba(156, 39, 176, 0.5)' } 
      }} 
    >
      <CardMedia
        component="img"
        height="180"
        image={ project.imageUrl || "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=170667a&w=0&k=20&c=Q7gLG-xfScdlTlPGFohllqpNqpxsU1jy8feD_fob87U=" }
        alt="Project Thumbnail"
      />
      <CardContent>
        <Typography variant="h6" color="secondary" sx={{ fontWeight: 600 }}>{project.title}</Typography>
        <Typography variant="body2" sx={{ color: '#ccc' }}>{project.description.substring(0, 100)}...</Typography>
      </CardContent>
    </Card>
  );
};

export default BrowseProjectItem;
