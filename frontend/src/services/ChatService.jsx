import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
});


export const fetchAllChats = async (userEmail) => {
    try {
        const response = await axiosInstance.get(`/chat/getall/${userEmail}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chats:", error);
        throw error;
    }
}

export const newChat = async (user1Email, user2Email) => {
    try {
        const response = await axiosInstance.post(`/chat/new`, {
            user1Email,
            user2Email
        });
        return response.data;
    }
    catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
}

export const sendMessage = async (chatID, from, text, timestamp) => {
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

export const messageUpdate = async (chatID, messageID) => {
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
