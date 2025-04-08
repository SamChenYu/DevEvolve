import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Container, CssBaseline, Typography, Paper, Grid, Button, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, alpha, Avatar
} from '@mui/material';
import Sidebar from '../layout/Sidebar';
import PaidIcon from '@mui/icons-material/Paid';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { incrementClientCoins, incrementDeveloperCoins } from '../../services/AuthenicationService';
import { UserContext } from '../../context/UserContext';

const Shop = () => {
    const theme = useTheme();
    const { user, loading } = useContext(UserContext);
    const [userBalance, setUserBalance] = useState(null); // Initialize user balance from context


    useEffect(() => {
        if (user) {
            setUserBalance(user.user.coins); // Update user balance from context
        }
    }, [user])

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

    const purchaseCoins = async (amount) => {
        try {

            if (!user) {
                console.error("User not authenticated. Cannot purchase coins.");
                return;
            }

            if(user.role === "ADMIN") {
                console.error("Admins cannot purchase coins.");
                return;
            }

            const response = user.role === "CLIENT" ? await incrementClientCoins(user.user.id, amount) : await incrementDeveloperCoins(user.user.id, amount);
            if (response) {
                console.log("Coins purchased successfully:", response);
                setUserBalance(response.coins); // Update user balance in state
            } else {
                console.error("Failed to purchase coins");
            }
        } catch (error) {
            console.error("Error purchasing coins:", error);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <Typography variant="h4" sx={{ color: theme.palette.secondary.main }}>
                    Loading...
                </Typography>
            </Box>
        );
    }
    

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


                



                <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", mb: 0 }}>
                    <Typography variant="h4" gutterBottom sx={{fontWeight: 600}}>Purchase Coins</Typography>

                    <Grid item xs={12} md={4} sx={{ 
                                            display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
                                            background: "purple", borderRadius: "10px", mb: "0"
                                            }}>
                        <Paper 
                        elevation={6}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: alpha('#fff', 0.15),
                            borderRadius: 3,
                            p: 2,
                            backdropFilter: 'blur(10px)'
                        }}
                        >
                        <Avatar 
                            sx={{ 
                            bgcolor: theme.palette.secondary.light, 
                            width: 46, 
                            height: 46,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            <MonetizationOnIcon sx={{ color: '#FFD700', fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="overline" sx={{ color: alpha('#fff', 0.7), display: 'block' }}>
                            Available Balance
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                            {userBalance} Coins
                            </Typography>
                        </Box>
                        </Paper>
                    </Grid>
                </Container>


                <Grid container spacing={3} justifyContent="center" sx={{mt: 0}}>
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
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button   onClick={() => {
                                handleCloseDialog();
                                purchaseCoins(selectedAmount);
                            }} color="secondary">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Shop;
