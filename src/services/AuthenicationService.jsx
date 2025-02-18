import axios from 'axios';

const API_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
});


export const clientRegistration = async (client) => {
    const response = await axiosInstance.post('/api/register/client', client);
    return response.data;
}

export const developerRegistration = async (developer) => {
    const response = await axiosInstance.post('/api/register/developer', developer);
    return response.data;
}


export const login = async (credentials) => {
    const response = await axiosInstance.post('/api/login', credentials);
    return response.data;
}

export const getUserFromToken = async () => {
    try {
        const response = await axiosInstance.get('/auth/users/profile', { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error("Unauthorized or session expired.");
    }
}

export const logout = async () => {
    await axiosInstance.post('/api/logout');
}
