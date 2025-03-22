import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
});


const fetchAllChats = async (userID) => {
    try {
        const response = await axiosInstance.get(`/chat/getall/${userID}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chats:", error);
        throw error;
    }
}

const newChat = async (clientID, developerID) => {
    try {
        const response = await axiosInstance.post(`/chat/new`, {
            clientID,
            developerID
        });
        return response.data;
    }
    catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
}   

const sendMessage = async (chatID, sender, text, timestamp) => {
    try {
        const response = await axiosInstance.post(`/chat/send`, {
            chatID,
            sender,
            text,
            timestamp
        });
        return response.data;
    }
    catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}

const messageUpdate = async (chatID, messageID) => {
    try {
        const response = await axiosInstance.post(`/chat/messageUpdate`, {
            chatID,
            messageID
        });
        return response.data;
    } catch (error) {
        console.error("Error updating message:", error);
        throw error;
    }
}

const searchUser = async (searchRequest, isClient) => {
    try {
        const response = await axiosInstance.post(`/chat/search`, {
            searchRequest,
            isClient
        });
        return response.data;
    } catch (error) {
        console.error("Error searching user:", error);
        throw error;
    }
}

const ChatService = { fetchAllChats, newChat, sendMessage, messageUpdate, searchUser };
export default ChatService;