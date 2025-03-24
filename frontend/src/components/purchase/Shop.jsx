import React, { useState } from 'react';
import {
    Box, Container, CssBaseline, Typography, Paper, Grid, Button, useTheme, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import Sidebar from '../layout/Sidebar';
import PaidIcon from '@mui/icons-material/Paid';

const Shop = () => {
    const theme = useTheme();

    const purchaseOptions = [
        { amount: 100, price: "£0.99" },
        { amount: 250, price: "£2.49" },
        { amount: 500, price: "£4.99" },
        { amount: 1000, price: "£8.99" },
        { amount: 1500, price: "£12.99" },
        { amount: 2500, price: "£19.99" },
    ];

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(null);

    const handleBuyNow = (amount) => {
        setSelectedAmount(amount);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box sx={{
            display: "flex",
            minHeight: "100vh",
            bgcolor: "#121212",
            color: "white",
            justifyContent: "center",
            p: 3
        }}>
            <CssBaseline />
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, p: 3}}>
                <Container>
                    <Typography variant="h4" gutterBottom sx={{fontWeight: 600}}>Purchase Coins</Typography>
                </Container>
                <Grid container spacing={3} justifyContent="center" sx={{mt: 20}}>
                    {purchaseOptions.map((prch) => (
                        <Grid item key={prch.amount} xs={12} sm={6} md={4} sx={{mb: 10}}>
                            <Paper elevation={5} sx={{ padding: 3, textAlign: "center", maxWidth: 300, mx: "auto", bgcolor: "#222", borderRadius: 6, '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 4px 20px rgba(156, 39, 176, 0.5)'}}}>
                                <Typography variant="h4" sx={{display: "flex", alignItems: "center", justifyContent: "center", color: "white"}}>
                                    <PaidIcon sx={{ color: '#FFD700', mr: 1, fontSize: 36}}/>
                                    {prch.amount}
                                </Typography>
                                <Typography variant="h6" sx={{color: "white"}}>{prch.price}</Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleBuyNow(prch.amount)}
                                    sx={{ mt: 2, bgcolor: theme.palette.secondary.main }}
                                >
                                    Buy Now
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Purchase</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to purchase {selectedAmount} Coins?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">Confirm</Button>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Shop;
