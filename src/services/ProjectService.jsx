const API_BASE_URL = "http://localhost:8080"; // Replace with your backend URL

export const createProject = async (clientId, projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/projects/create/${clientId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create project");
    }

    return await response.json(); // Return the created project data
  } catch (error) {
    console.error("Error creating project:", error);
    throw error; // Rethrow the error for handling in UI
  }
};