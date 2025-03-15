import axios from 'axios';

const API_BASE_URL = "http://localhost:8080"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

export const fetchAllProjects = async () => {
  try {
    const response = await axiosInstance.get("/auth/projects/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const browseProjectDetails = async (projectId) => {
  try {
    const response = await axiosInstance.get(`/auth/projects/${projectId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
}

export const fetchProjectRating = async (projectId) => {
  try {
      const response = await fetch(`/auth/projects/rating/${projectId}`);
      return response.data; 
  } catch (error) {
      console.error("Error fetching project rating:", error);
      return null; 
  }
};

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

export const placeBid = async (developerId, projectId, bidData) => {
  try {
    const response = await axiosInstance.post(`/auth/bids/place/${developerId}/${projectId}`, bidData);
    return response.data;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error.response?.data?.message || "Failed to place bid";
  }
};

export const minBidLevel = async (level) => {
  try {
    const response = await axiosInstance.get(`/auth/bids/min-bid/${level}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export const fetchBidsForProject = async (projectId) => {
  try {
    const response = await axiosInstance.get(`/auth/bids/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
};

export const getDeveloperBid = async (developerId, projectId) => {
  try {
    const response = await axiosInstance.get(`/auth/bids/developer-bid/${developerId}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
}

export const developerBids = async (developerId) => {
  try {
    const response = await axiosInstance.get(`/auth/bids/developer/${developerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
}

export const hireDeveloper = async (projectId, bidId) => {
  try {
    const response = await axiosInstance.put(`/auth/projects/hire/${projectId}/${bidId}`);
    return response.data;
  } catch (error) {
    console.error("Error hiring developer:", error);
    throw error.response?.data?.message || "Failed to hire developer";
  }
}

export const completeProject = async (projectId, report) => {
  try {
    const response = await axiosInstance.put(`/auth/projects/complete/${projectId}`, report, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error completing project:", error);
    throw error.response?.data?.message || "Failed to complete project";
  }
}

export const handleRatingSubmit = async (projectId, rating, feedback, ) => {
  try {
      const response = await axiosInstance.put(`/auth/projects/rate/${projectId}`, {
          ratingOutOfFive: rating,
          feedback: feedback
      });
      console.log("Rating submitted successfully:", response.data);
     
  } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
  }
};