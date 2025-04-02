import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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

export const getDeveloperById = async (id) => {
    try {
        const response = await axiosInstance.get(`/auth/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching developer:", error.response?.data || error.message);
        throw new Error("Failed to fetch developer.");
    }
};

export const login = async (credentials) => {
    const response = await axiosInstance.post('/api/login', credentials);
    return response.data;
}

export const getUserFromToken = async () => {
    try {
        const response = await axiosInstance.get('/auth/users/profile', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Failed to get user:", error.response?.data || error.message);
        throw new Error("Unauthorized or session expired.");
    }
}

export const refreshToken = async () => {
    try {
      const response = await axiosInstance.post("/api/refresh");
      return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        //throw new Error("Refresh failed. User needs to log in.");
        
    }
};

export const getAllDevelopers = async () => {
    try {
        const response = await axiosInstance.get('/auth/users/all');
        return response.data;
    } catch (error) {
        console.error("Error fetching developers:", error.response?.data || error.message);
        throw new Error("Failed to fetch developers.");
    }
}

export const searchDevelopers = async (query) => {
    try {
        const response = await axiosInstance.get(`/auth/users/search?query=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error searching developers:", error.response?.data || error.message);
        throw new Error("Failed to search developers.");
    }
}

export const getAllClients = async () => {
    try{
        const response= await axiosInstance.get('/auth/users/allClients');
        return response.data
    }catch(error){
        console.error("Error fetching clients:", error.response?.data || error.message);
        throw new Error("Failed to fetch clients.");

    }
}

export const searchClients = async (query) => {
    try {
        const response = await axiosInstance.get(`/auth/users/searchClients?query=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error searching clients:", error.response?.data || error.message);
        throw new Error("Failed to search clients.");
    }
}

export const logout = async () => {
    try {
        await axiosInstance.post('/api/logout'); 
        localStorage.clear(); 
    } catch (error) {
        console.error("Error during logout:", error.response?.data || error.message);
        throw new Error("Logout failed.");
    }
};

export const updateClientProfile = async (clientId, updatedData) => {
    try {
      const response = await axiosInstance.put(`/auth/admin/modifyClient/${clientId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating client profile:", error);
      throw error.response?.data?.message || "Failed to update client profile";
    }
  };
  
export const deleteClientProfile = async (clientId) => {
    try {
        const response = await axiosInstance.delete(`/auth/admin/deleteClient/${clientId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting client profile:", error);
        throw error.response?.data?.message || "Failed to delete client profile";
    }
};

export const updateDeveloperProfile = async (developerId, updatedData) => {

    try {
        const response = await axiosInstance.put(`/auth/admin/modifyDeveloper/${developerId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating developer profile:", error);
        throw error.response?.data?.message || "Failed to update developer profile";
    }
};

export const deleteDeveloperProfile = async (developerId) => {

    try {
        const response = await axiosInstance.delete(`/auth/admin/deleteDeveloper/${developerId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting developer profile:", error);
        throw error.response?.data?.message || "Failed to delete developer profile";
    }
};
  