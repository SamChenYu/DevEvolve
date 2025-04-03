import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Modal, Paper, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Users } from "lucide-react";


const ChooseUserModal = ({ open, handleClose, onUserSelect, users, setUsers, chats }) => {

    const noResults = users.length === 0;


    // open => OpenModal functinoality
    // handleClose => CloseModal function
    // onUserSelect => Function to handle user selection
    // users => List of users to display
    // chats => List of chats to display (Used to keep track of who not to show)

    const [userIDSet, setUserIDSet] = useState(new Set());
    useEffect(() => {
        const newSet = new Set();
        chats.forEach(chat => {
            newSet.add(chat.name1);
            newSet.add(chat.name2);
        });
        setUserIDSet(newSet);

        // trim the users array to only include users that are not in the chats
        const filteredUsers = users.filter(user => !userIDSet.has(user.firstName + " " + user.lastName));
        setUsers(filteredUsers);

    }, [open]);



    return (
        <Modal open={open} onClose={handleClose}>
            <Paper
                sx={{
                    position: "absolute",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60vw",
                    maxHeight: "80vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
            >   
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <IconButton onClick={handleClose} sx={{ margin: '0 10px 0 0' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2">
                        Choose a User
                    </Typography>
                </div>
                {noResults ? (
                    <Typography variant="body" sx={{ color: "red", justifyContent: "center", alignContent: "center"}}>No users found</Typography>
                ) : (
                    <Box>
                        {users.map((user) => (
                            <Box 
                                key={user.id} 
                                display="flex" 
                                alignItems="center" 
                                mb={2} 
                                sx={{
                                    padding: 1,
                                    borderRadius: 1,
                                    border: '2px solid transparent',
                                    '&:hover': {
                                        border: '2px solid purple',
                                        cursor: 'pointer',
                                    }
                                }}
                                >
                                <Users size={24} />
                                <Typography variant="body1" sx={{ ml: 2 }} onClick={() => onUserSelect(user.id, user.firstName + " " + user.lastName)}>
                                    {user.firstName + " "+  user.lastName}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Paper>
        </Modal>
    );
}

export default ChooseUserModal;