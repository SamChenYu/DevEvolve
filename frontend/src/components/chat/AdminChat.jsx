import React, { useContext, useState, useEffect } from 'react';
import { Box, CssBaseline, Paper, Typography,
     TextField, IconButton, Grid, alpha, useTheme,
    Container, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import SearchIcon from '@mui/icons-material/Search';
import { Users } from "lucide-react";
import ChatService from '../../services/ChatService';
import ChooseUserModal from './ChooseUserModal';
import { ChairTwoTone } from '@mui/icons-material';

const AdminChat = () => {

    const { user, loading } = useContext(UserContext);
    const theme = useTheme();




    // Search for a user's chats
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const [openModal, setOpenModal] = useState(false); // State to control modal visibility
    const handleSearchUser = async () => {
      if (!searchQuery.trim()) return; // Prevent searching for empty users
      
      try {
        setOpenModal(true);
        const clientSearchResults = await ChatService.searchUser(searchQuery, true);
        const devSearchResults = await ChatService.searchUser(searchQuery, false);
        const searchResults = [...clientSearchResults, ...devSearchResults];
        console.log("Search results:", searchResults);
        setSearchResults(searchResults); // Update search results state
        setSearchQuery(""); // Clear input after searching
        console.log("Search results:", searchResults);
      }
      catch (error) {
        console.error("Failed to search for user", error);
      }
    }

    // Load the chats for that user upon clicking the modal
    const [chats, setChats] = useState([]);
    const [manageUserID, setManageUserID] = useState(null); // State to store the selected user
    const [manageUserName, setManageUserName] = useState(""); // State to store the selected user name
    const loadChats = async (userID) => {
        try {
            const response = await ChatService.fetchAllChats(userID);
            console.log("Chats loaded:", response);
            setChats(response);
        } catch (error) {
            console.error("Failed to load chats", error);
        }
    }

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteChatID, setDeleteChatID] = useState(null); // State to store the selected chat to delete 


    // After deleting the chat, give the user a message - either success or failure
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [messageModalFeedback, setMessageFeedback] = useState(""); // State to store the message
    
    const handleDeleteChat = async () => {
        console.log(deleteChatID);
        try {
            const response = await ChatService.deleteChat(deleteChatID, user.user.id);
            console.log("Chat deleted:", response);
            setMessageFeedback("Chat messages deleted successfully");
            setMessageModalOpen(true);
        } catch (error) {
            console.error("Failed to delete chat", error);
            setMessageFeedback("Failed to delete chat messages");
            setMessageModalOpen(true);
        }

    }

    useEffect(() => {
      console.log("DeleteChatID changed:", deleteChatID);
    }, [deleteChatID]);





    if( loading ) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <Typography variant="h4" sx={{ color: theme.palette.secondary.main }}>
                    Loading...
                </Typography>
            </Box>
        );
    }




    return (
      <div>
      <Box sx={{ display: 'flex', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <CssBaseline />
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" color="white" sx={{ fontWeight: 600, mb: 3 }}>
            Manage Chats
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for Users..."
            value={searchQuery}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchUser();
              }
            }} 
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
          />


                <ChooseUserModal
                  open={openModal}
                  onUserSelect={ async (userID, userFirstName, userLastName) => {
                    loadChats(userID)
                    setOpenModal(false);
                    setManageUserID(userID);
                    setManageUserName(userFirstName);
                    console.log("User selected:", userID);
                  }}
                  handleClose={() => {setOpenModal(false);}}
                  chats = {[]}
                  users={searchResults}
                  setUsers = {setSearchResults}
                />
                  {manageUserID && chats.length === 0 && (
                    <Typography variant="body" sx={{ color: "red", justifyContent: "center", alignContent: "center"}}>User has no chats</Typography>
                  )}

                  {manageUserID && chats.length > 0 && (
                    <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                      {manageUserName}'s Chats
                    </Typography>
                  )}

                        {chats.map((chat) => (
                            <Box 
                                key={chat.id} 
                                display="flex" 
                                alignItems="center" 
                                mb={2} 
                                sx={{
                                    padding: 1,
                                    borderRadius: 1,
                                }}
                                >
                                <Users size={24} />
                              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Typography variant="body1" sx={{ ml: "20px", mt: "10px", textAlign: "left" }} onClick={() => console.log("Chat clicked")}>
                                {("Chat with " +
                                  (chat.name1 === manageUserName
                                    ? chat.name2 
                                    : chat.name1)
                                )}


                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => {
                                    setDeleteModalOpen(true)
                                    setDeleteChatID(chat.chatID)
                                  }}
                                  sx={{
                                      fontWeight: 100,
                                      marginRight: 0,
                                      float: "right"
                                  }}
                                >
                                    Clear Chat Messages
                                </Button>
                                </Typography>
                              </div>
                            </Box>
                        ))}



                      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} >
                          <Box sx={{ bgcolor: '#222', color: 'white' }}>

                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogContent>
                                  <Typography>Are you sure you want to delete chat messages? This action cannot be undone.</Typography>
                              </DialogContent>
                              <DialogActions>
                                  <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                                      Cancel
                                  </Button>
                                  <Button onClick={() => { 
                                      handleDeleteChat()
                                      setDeleteModalOpen(false);
                                      setDeleteChatID(null);
                                       } } color="error">
                                      Delete
                                  </Button>
                              </DialogActions>
                          </Box>
                      </Dialog>


                      <Dialog open={messageModalOpen} onClose={() => setMessageModalOpen(false)} >
                          <Box sx={{ bgcolor: '#222', color: 'white' }}>

                              <DialogTitle>Action</DialogTitle>
                              <DialogContent>
                                  <Typography>{messageModalFeedback}</Typography>
                              </DialogContent>
                              <DialogActions>
                                  <Button onClick={() => setMessageModalOpen(false)} color="primary">
                                      Ok
                                  </Button>
                              </DialogActions>
                          </Box>
                      </Dialog>



        </Box>
      </Box>
      
      </div>
    );
}

export default AdminChat;