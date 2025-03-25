import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const API_URL = process.env.REACT_APP_API_URL;


// There are two web socket services in the application, one for the chat messages and the other for the chat lists
// /topics/chat/{chatID} is used for chat messages
// /topic/user/{userID} is used for chat lists

const useWebSocket = (endpointParam, endpoint, onNewMessage) => {
  const [connected, setConnected] = useState(false);
  const stompClient = useRef(null);

  // Connect to the WebSocket server
  const connect = () => {
    const socket = new SockJS(`${API_URL}/message`); // WebSocket endpoint
    stompClient.current = Stomp.over(socket);
    
    stompClient.current.connect({}, () => {
      setConnected(true);
      console.log('Connected to WebSocket');
      
      // Subscribe to the specific chat topic
      stompClient.current.subscribe(`/topic/${endpoint}/${endpointParam}`, (messageOutput) => {
        // Trigger the API call or update when a new message is received
        if (onNewMessage) {
          onNewMessage(messageOutput);
        }
      });
    }, (error) => {
      console.log('Error connecting to WebSocket:', error);
    });
  };

  // Disconnect WebSocket connection
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        setConnected(false);
        console.log('Disconnected from WebSocket');
      });
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [endpointParam]); // Reconnect when the endpointParam changes

  return { connected }; 
};

export default useWebSocket;
