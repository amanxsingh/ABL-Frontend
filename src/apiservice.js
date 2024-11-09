// apiService.js
import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login function
export const login = async (usernameOrEmail, password) => {
  try {
    const response = await apiClient.post("/login/", {
      username_or_email: usernameOrEmail,
      password,
    });
    const { username } = response.data;

    // Store the login data in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("isAuthenticated", "true");

    return { success: true, username };
  } catch (error) {
    const errorMessage =
      error.response?.data?.non_field_errors || "Login failed.";
    return { success: false, error: errorMessage };
  }
};

// Register function
export const register = async (formData) => {
  try {
    const response = await apiClient.post("/register/", formData);

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Registration failed.";
    return { success: false, error: errorMessage };
  }
};

// Fetch student dashboard data
export const fetchStudentDashboard = async (username) => {
  try {
    const response = await apiClient.get(`/student_dashboard/${username}/`, {
      headers: {
        Authorization: "Basic c3R1ZGVudDE6cGFzc3dvcmQxMjM0", // Replace with your actual credentials or use JWT token
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = "Error fetching dashboard data";
    return { success: false, error: errorMessage };
  }
};

// Fetch curriculum data
export const curriculum = async (subject, standard) => {
  try {
    const response = await apiClient.get(
      `/curriculum/${standard}/${subject}/`,
      {
        headers: {
          Authorization: "Basic c3R1ZGVudDE6cGFzc3dvcmQxMjM0", // Replace with your actual credentials or use JWT token
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching curriculum:", error); // Log error details
    const errorMessage = "Error fetching curriculum data";
    return { success: false, error: errorMessage };
  }
};

export const fetchStudentProfile = async (username) => {
  try {
    const response = await apiClient.get(`/student-profile/${username}/`, {
      headers: {
        Authorization: "Basic c3R1ZGVudDE6cGFzc3dvcmQxMjM0", // Replace with actual credentials
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: "Error fetching profile data." };
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await apiClient.post("/logout/");

    if (response.status === 200) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      localStorage.removeItem("isAuthenticated");
      return { success: true };
    } else {
      throw new Error("Logout failed.");
    }
  } catch (error) {
    return { success: false, error: "Logout failed. Please try again." };
  }
};
