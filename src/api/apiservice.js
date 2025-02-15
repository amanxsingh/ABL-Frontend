import axios from "axios";

const BASE_URL = "https://mechanzo.com/";

// Create Axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token dynamically to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`; // Ensure token is included
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function for handling errors
const handleError = (error, defaultMessage) => {
  return error.response?.data?.detail || defaultMessage;
};

// **Login Function**
export const login = async (username_or_email, password) => {
  try {
    const response = await apiClient.post("/account/login/", { username_or_email, password })

    const { token, username, dashboard_url, role } = response.data;

    // Store authentication details
    localStorage.setItem("authToken", token);
    localStorage.setItem("username", username);
    localStorage.setItem("dashboard_url", dashboard_url);
    localStorage.setItem("role", role || "");
    localStorage.setItem("isAuthenticated", "true");

    console.log("User Role:", role); // ✅ Debugging log
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Login failed:", error.response?.data || error);
    return { success: false, error: handleError(error, "Invalid credentials") };
  }
};



// **Fetch Student Dashboard**
export const fetchStudentDashboard = async (username) => {
  try {
    const response = await apiClient.get(`/student_dashboard/${username}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching student dashboard:", error.response?.data || error);
    return { success: false, error: handleError(error, "Failed to load dashboard.") };
  }
};

// **Fetch School Dashboard**
export const fetchSchoolDashboard = async (username) => {
  try {

    // ✅ Corrected API call, baseURL is automatically prepended
    const response = await apiClient.get(`/school_dashboard/${username}/`);

    console.log(response.data);
    return { success: true, data: response.data };

  } catch (error) {
    console.error("Error fetching school dashboard:", error.response?.data || error);
    return { success: false, error: handleError(error, "Failed to load School dashboard.") };
  }
};


// **Register Student**
export const register = async (userData) => {
  try {
    const response = await apiClient.post("/account/register/", userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Registration failed" };
  }
};

// **Fetch Curriculum Data**
export const curriculum = async (subject, standard) => {
  try {
    const response = await apiClient.get(`/curriculum/${standard}/${subject}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    return { success: false, error: handleError(error, "Error fetching curriculum data.") };
  }
};

// **Fetch Student Profile**
export const fetchStudentProfile = async (username) => {
  try {
    const response = await apiClient.get(`/student_dashboard/student-profile/${username}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleError(error, "Error fetching profile data.") };
  }
};

// **Logout Function**
export const logout = async () => {
  try {
    await apiClient.post("/account/logout/");
    localStorage.clear();
    navigate("/login");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Logout failed. Please try again." };
  }
};


export const updateStudentProfile = async (username, profileData) => {
  try {
    const response = await apiClient.put(`/student_dashboard/student-profile/${username}/`, profileData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleError(error, "Failed to update profile.") };
  }
};

// **Patch Student Profile (PATCH)**
export const patchStudentProfile = async (username, profileData) => {
  try {
    const response = await apiClient.patch(`/student_dashboard/student-profile/${username}/`, profileData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleError(error, "Failed to update profile.") };
  }
};

// **Update Student Avatar**
export const updateStudentAvatar = async (username, avatarFile) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await apiClient.post(
      `/student_dashboard/student-profile/${username}/update-avatar/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleError(error, "Failed to update avatar.") };
  }
};




// **Fetch Document as Blob**
export const fetchDocument = async (url) => {
  try {
    const response = await apiClient.get(url, { responseType: "blob" });
    if (response.status !== 200) throw new Error("Failed to fetch the document");

    const fileType = response.headers["content-type"];
    return { success: true, blob: response.data, fileType };
  } catch (error) {
    console.error("Error fetching document:", error);
    return { success: false, error: handleError(error, "Failed to fetch document.") };
  }
};
