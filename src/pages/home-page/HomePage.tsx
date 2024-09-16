import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardActionArea } from '@mui/material';
// import CreateOffer from './CreateOffer';  // Assuming CreateOffer component exists
// import ViewOffers from './ViewOffers';    // Assuming ViewOffers component exists

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
      flexDirection="column" 
      gap={4}
    >
      {/* Create Offer Box */}
      <Card sx={{ width: 300, height: 200 }}>
        <CardActionArea onClick={() => navigate('/create-offer')} sx={{ height: '100%' }}>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%"
            sx={{ bgcolor: 'primary.main', color: 'white' }}
          >
            <Typography variant="h5" component="div">
              Create Offer
            </Typography>
          </Box>
        </CardActionArea>
      </Card>

      {/* View Offers Box */}
      <Card sx={{ width: 300, height: 200 }}>
        <CardActionArea onClick={() => navigate('/view-offers')} sx={{ height: '100%' }}>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%"
            sx={{ bgcolor: 'secondary.main', color: 'white' }}
          >
            <Typography variant="h5" component="div">
              View Offers
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default HomePage;
