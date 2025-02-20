import axios from 'axios';
const API_BASE_URL = "http://localhost:8080"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

export const fetchProjectDetails = async (clientId, projectId) => {
  try {
    const response = await axiosInstance.get(`/auth/projects/client/${clientId}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

export const createProject = async (clientId, projectData) => {
  try {
    const response = await axiosInstance.post(`/auth/projects/create/${clientId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error.response?.data?.message || "Failed to create project";
  }
};