
import React, { useContext, useEffect } from 'react';
import { Box, CssBaseline, Paper, Typography } from '@mui/material';
import Sidebar from '../layout/Sidebar';
import { UserContext } from '../../context/UserContext';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';

import UserContext from '../../context/UserContext';
import ChatService from '../../services/ChatService';

import './Chat.css';

const Chat = () => {


    const { user, loading } = useContext(UserContext);

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
          <div className="discussion message-active">
            <div className="photo" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)'}}>
              <div className="online"></div>
            </div>
            <div className="desc-contact">
              <p className="name">Megan Leib</p>
              <p className="message">9 pm at the bar if possible 😳</p>
            </div>
            <div className="timer">12 sec</div>
          </div>

          <div className="discussion">
            <div className="photo" style={{backgroundImage: 'url(https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg)'}}>
              <div className="online"></div>
            </div>
            <div className="desc-contact">
              <p className="name">Dave Corlew</p>
              <p className="message">Let's meet for a coffee or something today ?</p>
            </div>
            <div className="timer">3 min</div>
          </div>

        </section>


        { /* Individual Chat Window */ }
        <section className="chat">
          <div className="header-chat">

            <div className="photo" style={{backgroundImage: 'url(https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg)'}}>
              <div className="online"></div>
            </div>
            <p className="name">Megan Leib</p>
  
          </div>
          <div className="messages-chat">

            <div className="message">
              <p className="text"> Hi, how are you ? </p>
            </div>

            <p className="time"> 14h58</p>
            <div className="message text-only">
              <div className="response">
                <p className="text"> Hey Megan ! It's been a while 😃</p>
              </div>
            </div>
            <div className="message text-only">
              <div className="response">
                <p className="text"> When can we meet ?</p>
              </div>
            </div>
            <p className="response-time time"> 15h04</p>
          </div>

          { /* Write a message */ }
          <div className="footer-chat">
            <AttachFileIcon className="icon attach clickable" style={{ fontSize: '50px', marginRight: '10px', color: 'purple'}} aria-hidden="true"/>
            <input type="text" className="write-message" placeholder="Type your message here"/>
            <SendIcon className="icon send clickable" style={{ fontSize: '50px', marginLeft: '10px', color: 'purple'}} aria-hidden="true"/>
          </div>

        </section>
      </div>
    </Box>
      );
    }


export default Chat;