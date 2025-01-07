import axios from "axios";

const BASE_URL = "https://credible-becoming-spider.ngrok-free.app"; // Match the backend URL from your `curl` request

// Create Axios instance with base URL
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically to every request
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   console.log("Token in interceptor:", token); // Debugging log
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     console.error("No token found in localStorage");
//   }
//   console.log("Request Headers:", config.headers); // Debugging log for headers
//   return config;
// });
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));

  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (csrfToken) config.headers["X-CSRFTOKEN"] = csrfToken.split("=")[1];

  return config;
});

// Utility function for error handling
const handleError = (error, defaultMessage) => {
  return error.response?.data?.error || defaultMessage;
};

// Login function
export const login = async (usernameOrEmail, password) => {
  try {
    const csrfToken = localStorage.getItem("csrfToken"); // Assuming CSRF token is saved in localStorage
    const response = await apiClient.post(
      "/login/",
      {
        username_or_email: usernameOrEmail,
        password,
      },
      {
        headers: {
          "X-CSRFTOKEN": csrfToken, // Include CSRF token in header
        },
      }
    );
    const { token, username, dashboard_url } = response.data;

    // Store the token and other details in localStorage
    console.log("Storing token:", token); // Debugging log
    localStorage.setItem("authToken", token); // Save token here
    localStorage.setItem("username", username);
    localStorage.setItem("dashboard_url", dashboard_url);
    localStorage.setItem("isAuthenticated", "true");

    return { success: true, username, dashboard_url };
  } catch (error) {
    return { success: false, error: handleError(error, "Login failed.") };
  }
};

// Register function
export const register = async (formData) => {
  try {
    const response = await apiClient.post("/register/", formData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, "Registration failed."),
    };
  }
};

// Fetch student dashboard data
export const fetchStudentDashboard = async (username) => {
  try {
    const response = await apiClient.get(`/student_dashboard/${username}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, "Error fetching dashboard data."),
    };
  }
};

// Fetch curriculum data
export const curriculum = async (subject, standard) => {
  try {
    const response = await apiClient.get(`/curriculum/${standard}/${subject}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    return {
      success: false,
      error: handleError(error, "Error fetching curriculum data."),
    };
  }
};

// Fetch student profile
export const fetchStudentProfile = async (username) => {
  try {
    const response = await apiClient.get(`/student-profile/${username}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, "Error fetching profile data."),
    };
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await apiClient.post("/logout/");
    if (response.status === 200) {
      localStorage.clear();
      return { success: true };
    } else {
      throw new Error("Logout failed.");
    }
  } catch (error) {
    return { success: false, error: "Logout failed. Please try again." };
  }
};

// Fetch document as Blob
export const fetchDocument = async (url) => {
  try {
    const response = await apiClient.get(url, {
      responseType: "blob",
    });

    if (response.status !== 200)
      throw new Error("Failed to fetch the document");

    const fileType = response.headers["content-type"];
    return { success: true, blob: response.data, fileType };
  } catch (error) {
    console.error("Error fetching document:", error);
    return {
      success: false,
      error: handleError(error, "Failed to fetch document."),
    };
  }
};
