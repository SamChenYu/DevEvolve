import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const clientRegistration = async (client) => {
    const response = await axios.post(`${API_URL}/register/client`, client);
    return response.data;
}

export const developerRegistration = async (developer) => {
    const response = await fetch('http://localhost:8080/api/register/developer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(developer)
    });
    
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
    }
    
    return response.json();
};

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
}