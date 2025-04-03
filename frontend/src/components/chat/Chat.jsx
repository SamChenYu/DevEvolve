
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, CssBaseline, Paper, Typography, TextField, IconButton } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';

import { UserContext } from '../../context/UserContext';
import ChatService from '../../services/ChatService';
import useWebSocket from '../../services/WebSocketService';

import ChooseUserModal from './ChooseUserModal';
import './Chat.css';

const Chat = () => {

  const { user, loading } = useContext(UserContext);

  // Handling of loading chats
  const [chats, setChats] = useState([]);
  useEffect(() => {
    if(!user || !user.user.id) {
      return;
    }
    const fetchChats = async () => {
      try {
        const chatData = await ChatService.fetchAllChats(user.user.id);
        setChats(chatData);
        console.log("User Data:", user);
        console.log("Chats:", chatData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [user]);




  // Get the profile pictures of all users with chats
  const defaultProfilePicture = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png";
  const [currentUserID, setCurrentUserID] = useState("");
  useEffect(() => {
    if (user && user.user && user.user.id) {
      setCurrentUserID(user.user.id);
    }
  }, [user]);
  const [profilePictures, setProfilePictures] = useState({}); // Hashmap userID -> profile picture URL
   useEffect(() => {
     const fetchProfilePictures = async () => {
       const newProfilePictures = {...profilePictures};
       const uniqueUserIDs = new Set();
       chats.forEach(({ user1ID, user2ID }) => {
        if (!profilePictures[user1ID]) uniqueUserIDs.add(user1ID);
        if (!profilePictures[user2ID]) uniqueUserIDs.add(user2ID);
      });

      const fetchPromises = Array.from(uniqueUserIDs).map(async (userID) => {
        try {

          const userData = await ChatService.getProfilePicture(userID);
          //console.log("UserData Profile Picture:", userData);
          if (userData && userData.imageUrl) {
            console.log("Profile picture found for user:", userID, userData.imageUrl);
            newProfilePictures[userID] = userData.imageUrl;
          } else {
            newProfilePictures[userID] = defaultProfilePicture; // Set default picture if not found
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
          newProfilePictures[userID] = defaultProfilePicture; // Set default picture on error
        }
      });
      await Promise.all(fetchPromises);
      setProfilePictures(newProfilePictures); // Update state with new profile pictures


     } // End of fetchProfilePictures
     fetchProfilePictures();

     if(Object.keys(profilePictures).length === 0) {
     }
    }, [chats]);

    useEffect(() => {
      console.log("Profile pictures state updated:", profilePictures);
    }, [profilePictures]); // This will log the updated state whenever it changes















  // Handling of active chats
  const [activeChatID, setActiveChatID] = useState(null); // To store the selected chat ID
  const [activeChatName, setActiveChatName] = useState(null); // To store the selected chat name
  const [activeChatProfilePicture, setActiveChatProfilePicture] = useState(defaultProfilePicture); // To store the selected chat profile picture
  const [lastMessageID, setLastMessageID] = useState(0); // To store the last message ID
  const handleChatClick = (chatID) => {
    if (chatID !== activeChatID) { // Avoid setting activeChatID to the same value
      //setLastMessageID(0); // Reset the last message ID
      setActiveChatID(chatID); // Set the clicked chat as active
      console.log("Clicked chat:", chatID);
    }
    
  };

  // Effect to set the lastMessageID based on the active chat
  useEffect(() => {
    if (activeChatID) {
      const activeChat = chats.find(chat => chat.chatID === activeChatID);
      if (activeChat && activeChat.messages && activeChat.messages.length > 0) {
        setLastMessageID(activeChat.messages[activeChat.messages.length - 1].id); // Set last message ID when activeChat changes
      }

      // Fetch the profile picture of the active chat
      const otherUserID = (user.user.id === activeChat.user1ID) ? activeChat.user2ID : activeChat.user1ID;
      try  {
        const fetchProfilePicture = async () => {
          const userData = await ChatService.getProfilePicture(otherUserID);
          if (userData && userData.imageUrl) {
            setActiveChatProfilePicture(userData.imageUrl);
          } else {
            setActiveChatProfilePicture(defaultProfilePicture); // Set default picture if not found
          }
        };
        fetchProfilePicture();
      }
      catch (error) {
        console.error("Error fetching profile picture:", error);
        setActiveChatProfilePicture(defaultProfilePicture); // Set default picture on error
      }


    }
  }, [activeChatID, chats]); // Only re-run this effect when activeChatID or chats change



  //Sending of messages
  const [messageText, setMessageText] = useState("");
  const handleSendMessage = async () => {
    if (!messageText.trim()) return; // Prevent sending empty messages

    const timestamp = new Date().toISOString(); // Current timestamp
    try {
      await ChatService.sendMessage(activeChatID, user.user.id, messageText, timestamp);
      setMessageText(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  // New chat creation
  const [searchUserText, setSearchUserText] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const handleSearchUser = async () => {
    if (!searchUserText.trim()) return; // Prevent searching for empty users
    
    const isClient = user.role === "CLIENT"; // Check if the user is a client
    try {
      const searchResults = await ChatService.searchUser(searchUserText, isClient);
      console.log("Search results:", searchResults);
      setSearchResults(searchResults); // Update search results state
      setSearchUserText(""); // Clear input after searching
      // If there is a result, create a new chat

      setOpenModal(true); // Todo: Open modal to show search results


      // Uncomment code if you want automatic chat creation when only one result is found
      // if (searchResults.length === 1) {
      //   const clientID = isClient ? user.user.id : searchResults[0].id;
      //   const developerID = isClient ? searchResults[0].id : user.user.id;
      //   const chat = await ChatService.newChat(clientID, developerID);
      //   setChats([...chats, chat]); // Add the new chat to the list
      //   setActiveChatID(chat.chatID); // Set the new chat as active
      //   setActiveChatName(searchResults[0].firstName + " " + searchResults[0].lastName); // Set the new chat's name
      // } else {
      //   // Open Modal to show search results
      // }

    }
    catch (error) {
      console.error("Failed to search for user", error);
    }
  }


  /*
    TWO WEB SOCKET CONNECTIONS ARE REQUIRED:
    - Connection ot active chat [activeChatID] -> listens for new messages sent to the active chat
    - Connection to user. If a new chat is created, the user will receive a message to update the chat list
  */

  const { userConnection } = useWebSocket(user?.user?.id ?? null, "user", (messageOutput) => {
    console.log("Websocket message to update chatlist");
    // Fetch chat again
    const fetchNewMessages = async () => {
      try {
        const chatData = await ChatService.fetchAllChats(user.user.id);
        setChats(chatData);
        console.log("User Data:", user);
        console.log("Chats:", chatData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
    fetchNewMessages();
  });





  const { chatConnection } = useWebSocket(activeChatID || null, "chat", (messageOutput) => {
    console.log("New message received for active chat:", messageOutput);
    
    if(messageOutput.body === "Deleted") {
      // Clear the chat
      setLastMessageID(0);
      const tempChatID = activeChatID;
      setActiveChatID(null);
      setActiveChatID(tempChatID);
    }

    // Now need to fetch new messages for the active chat
    const fetchNewMessages = async () => {
      try {
        const chatData = await ChatService.fetchAllChats(user.user.id);
        setChats(chatData);
        console.log("User Data:", user);
        console.log("Chats:", chatData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
    fetchNewMessages();
  });

  // Reference to scroll to the bottom of the chat
  const messagesEndRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeChatID]);




  if(loading) {
    return <Typography variant="h4">Loading...</Typography>;
  }


    return (

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "black", color: "white" }}>
      <CssBaseline />      
      <Sidebar />
      <div className="container">

        { /* Discussions (Chats)*/ }
        <section className="discussions">
          <div className="discussion search">
          <TextField
                fullWidth
                variant="outlined"
                placeholder="Search..."
                value={searchUserText}
                onChange={(e) => setSearchUserText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchUser()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearchUser}>
                      <SearchIcon style={{ fontSize: '30px'}} color='secondary'/>
                    </IconButton>
                  ),
                }}
          
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',
                    backgroundColor: '#444', 
                    
                  },
                  '& .MuiInputBase-input': {
                    color: 'white', 
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'white', 
                  },
                  m: 1,
                }}
              />
          </div>

            {chats.map((chat) => { 
              const chatName = ((user.user.firstName + " " + user.user.lastName) === chat.name1) ? chat.name2 : chat.name1; // Get the name of the other user
              const chatClass = activeChatID === chat.chatID ? "discussion message-active" : "discussion"; // Active chat has purple highlighting
              // Get the last message from the chat
              const lastMessage = chat.messages?.length > 0 ? chat.messages[chat.messages.length - 1] : null;

              // Format timestamp
              const formatTime = (timestamp) => {
                if (!timestamp) return "";
                const date = new Date(timestamp);
                const now = new Date();

                // If it's today, show HH:mm, otherwise show DD/MM/YYYY HH:mm
                if (date.toDateString() === now.toDateString()) {
                  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                }
                return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              };


              return (
                <div key={chat.chatID} className={chatClass}  onClick={() => {handleChatClick(chat.chatID); setActiveChatName(chatName)}}>
                <div
                  className="photo"
                  style={{
                    backgroundImage: `url(${
                      (currentUserID === chat.user1ID || currentUserID === chat.user2ID)
                        ? profilePictures[currentUserID === chat.user1ID ? chat.user2ID : chat.user1ID]
                        : ""
                    })`
                  }}
                >
                  <div className="online"></div>
                </div>
                <div className="desc-contact">
                  <p className="name">{chatName}</p>
                  <p className="message">{lastMessage ? lastMessage.text : "No messages yet"}</p>
                </div>
                <div className="timer">{lastMessage ? formatTime(lastMessage.timestamp) : ""}</div>
              </div>
            )})}


        </section>


        { /* Individual Chat Window */ }
        {activeChatID && (
        <section className="chat">
          <div className="header-chat">

            <div className="photo" 
                  style={{
                    backgroundImage: `url(${ activeChatProfilePicture ? activeChatProfilePicture : defaultProfilePicture
                    })`
                  }}
            >
              <div className="online"></div>
            </div>
            <p className="name">{activeChatName}</p>
          </div>
          <div className="messages-chat">



          {chats.find(chat => chat.chatID === activeChatID)?.messages.map((message, index, arr) => {
            const isUserMessage = message.sender === String(user.user.id);
            const isLastInChunk = index === arr.length - 1 || arr[index + 1].sender !== message.sender;

            // Timestamp functions -> if it is today then only display time
            const messageDate = new Date(message.timestamp);
            const now = new Date();
            const isToday = messageDate.toDateString() === now.toDateString();
            const formattedTime = new Intl.DateTimeFormat('en-GB', {
              hour: '2-digit', minute: '2-digit',
              hour12: !isToday,
              timeZone: 'UTC'
            }).format(messageDate);
            
            // Display the full date
            const formattedDate = isToday 
              ? formattedTime
              : new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                  hour12: true, timeZone: 'UTC'
                }).format(messageDate); // Otherwise, show full date + time


                if(message.from === "System") {
                  return (
                    <div key={message.id} className="message" style={{color: "red", justifyContent: "center", alignItems: "center"}}>
                      <p className="text">Chat has been deleted by admin</p>
                    </div>
                  );
                }

            return (
              <React.Fragment key={message.id}>
                <div className={`message text-only"`}>
                  {isUserMessage ? (
                    <div className="response">
                    <p className="text">{message.text}</p>
                  </div>
                  ) : (
                    <p className="text">{message.text}</p>

                  )}
                </div>
                
                {isLastInChunk && <p className={isUserMessage ? "response-time time" : "time"}>{formattedDate}</p>}
              </React.Fragment>
            );
          })}

              <div ref={messagesEndRef} />
          </div>

          { /* Write a message */ }
          <div className="footer-chat">
            <AttachFileIcon className="icon attach clickable" style={{ fontSize: '50px', marginRight: '10px', color: 'purple'}} aria-hidden="true"/>
            <input type="text" className="write-message" placeholder="Type your message here" value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}/>
            <SendIcon className="icon send clickable" style={{ fontSize: '50px', marginLeft: '10px', color: 'purple'}} aria-hidden="true"/>
          
          </div>

        </section>
        )}




      </div>
      <ChooseUserModal
        open={openModal}
        onUserSelect={ async (userID) => {
          setOpenModal(false);
          const isClient = user.role === "CLIENT";
          const clientID = isClient ? user.user.id : searchResults[0].id;
          const developerID = isClient ? searchResults[0].id : user.user.id;
          try {
            const chat = await ChatService.newChat(clientID, developerID);
            setChats((prevChats) => [...prevChats, chat]); // Use functional update to avoid stale state issues
            setActiveChatID(chat.chatID);
            setActiveChatName(`${searchResults[0].firstName} ${searchResults[0].lastName}`);
          } catch (error) {
            console.error("Failed to create a new chat:", error);
          }
        }}
        handleClose={() => {setOpenModal(false);}}
        chats = {chats}
        users={searchResults}
        setUsers = {setSearchResults}
      />
    </Box>
      );
    }


export default Chat;