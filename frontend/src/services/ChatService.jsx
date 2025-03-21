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

const newChat = async (user1ID, user2ID) => {
    try {
        const response = await axiosInstance.post(`/chat/new`, {
            user1ID,
            user2ID
        });
        return response.data;
    }
    catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
}

const sendMessage = async (chatID, from, text, timestamp) => {
    try {
        const response = await axiosInstance.post(`/chat/send`, {
            chatID,
            from,
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

const ChatService = { fetchAllChats, newChat, sendMessage, messageUpdate };
export default ChatService;