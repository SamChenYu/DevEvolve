
import React, { useContext, useEffect, useState } from 'react';
import { Box, CssBaseline, Paper, Typography } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';

import { UserContext } from '../../context/UserContext';
import ChatService from '../../services/ChatService';

import './Chat.css';

const Chat = () => {

  const { user, loading } = useContext(UserContext);
  


  /// Load every single chat
  const [chats, setChats] = useState([]);
  const [activeChatID, setActiveChatID] = useState(null); // To store the selected chat ID
  const [activeChatName, setActiveChatName] = useState(null); // To store the selected chat name
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

  const handleChatClick = (chatID) => {
    console.log("Clicked chat:", chatID);
    setActiveChatID(chatID); // Set the clicked chat as active
  };


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
            <div className="searchbar">
              <input type="text" placeholder="Search..."/>
              <SearchIcon className="icon" style={{ fontSize: '30px', color: 'black'}} aria-hidden="true"/>
            </div>
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
                  style={{ backgroundImage: `url(${chat.photoUrl || 'https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg'})` }}
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

            <div className="photo" style={{backgroundImage: 'url(https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg)'}}>
              <div className="online"></div>
            </div>
            <p className="name">{activeChatName}</p>
          </div>
          <div className="messages-chat">



          {chats.find(chat => chat.chatID === activeChatID)?.messages.map((message, index, arr) => {
            const isUserMessage = message.sender === String(user.user.id);
            const isLastInChunk = index === arr.length - 1 || arr[index + 1].sender !== message.sender;
            console.log(isUserMessage, message.sender, user.user.id);

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

            return (
              <React.Fragment key={message.id}>
                <div className={`message text-only"`}>
                  {isUserMessage ? (
                    <p className="text">{message.text}</p>
                  ) : (
                    <div className="response">
                    <p className="text">{message.text}</p>
                  </div>
                  )}
                </div>
                
                {isLastInChunk && <p className={isUserMessage ? "time" : "response-time time"}>{formattedDate}</p>}
              </React.Fragment>
            );
          })}

            
          </div>

          { /* Write a message */ }
          <div className="footer-chat">
            <AttachFileIcon className="icon attach clickable" style={{ fontSize: '50px', marginRight: '10px', color: 'purple'}} aria-hidden="true"/>
            <input type="text" className="write-message" placeholder="Type your message here"/>
            <SendIcon className="icon send clickable" style={{ fontSize: '50px', marginLeft: '10px', color: 'purple'}} aria-hidden="true"/>
          </div>

        </section>
        )}




      </div>
    </Box>
      );
    }


export default Chat;