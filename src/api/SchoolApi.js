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

// **Fetch School Dashboard**
export const fetchSchoolDashboard = async (username) => {
  try {
    const response = await apiClient.get(`/school_dashboard/${username}/`);
    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching school dashboard:", error.response?.data || error);
    return { success: false, error: handleError(error, "Failed to load School dashboard.") };
  }
};

// **Fetch Advocacy Report**
export const fetchAdvocacyReport = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/advocacyreport/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching advocacy report:", error);
    return { success: false, error: handleError(error, "Failed to fetch advocacy report.") };
  }
};

// **Create Advocacy Report**
export const createAdvocacyReport = async (reportData) => {
  try {
    const response = await apiClient.post(`/school_dashboard/advocacyreport/`, reportData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating advocacy report:", error);
    return { success: false, error: handleError(error, "Failed to create advocacy report.") };
  }
};

// **Fetch Homework Reports**
export const fetchHomeworkReports = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/homework_reports/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching homework reports:", error);
    return { success: false, error: handleError(error, "Failed to fetch homework reports.") };
  }
};

// **Fetch Innovation Club**
export const fetchInnovationClub = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/innovationclub/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching innovation club:", error);
    return { success: false, error: handleError(error, "Failed to fetch innovation club.") };
  }
};

// **Create Innovation Club**
export const createInnovationClub = async (clubData) => {
  try {
    const response = await apiClient.post(`/school_dashboard/innovationclub/`, clubData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating innovation club:", error);
    return { success: false, error: handleError(error, "Failed to create innovation club.") };
  }
};

// **Fetch Inventory**
export const fetchInventory = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/inventory/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return { success: false, error: handleError(error, "Failed to fetch inventory.") };
  }
};

// **Create Inventory**
export const createInventory = async (inventoryData) => {
  try {
    const response = await apiClient.post(`/school_dashboard/inventory/`, inventoryData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating inventory:", error);
    return { success: false, error: handleError(error, "Failed to create inventory.") };
  }
};

// **Partially Update Inventory**
export const partialUpdateInventory = async (inventoryData) => {
  try {
    const response = await apiClient.patch(`/school_dashboard/inventory/`, inventoryData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error partially updating inventory:", error);
    return { success: false, error: handleError(error, "Failed to partially update inventory.") };
  }
};

// **Fetch Kreativity Show**
export const fetchKreativityShow = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/kreativityshow/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching kreativity show:", error);
    return { success: false, error: handleError(error, "Failed to fetch kreativity show.") };
  }
};

// **Create Kreativity Show**
export const createKreativityShow = async (showData) => {
  try {
    const response = await apiClient.post(`/school_dashboard/kreativityshow/`, showData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating kreativity show:", error);
    return { success: false, error: handleError(error, "Failed to create kreativity show.") };
  }
};

// **Fetch Leaderboard**
export const fetchLeaderboard = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/leaderboard/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: handleError(error, "Failed to fetch leaderboard.") };
  }
};

// **Fetch Macro Planner**
export const fetchMacroPlanner = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/macroplanner/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching macro planner:", error);
    return { success: false, error: handleError(error, "Failed to fetch macro planner.") };
  }
};

// **Create Macro Planner**
export const createMacroPlanner = async (plannerData) => {
  try {
    const response = await apiClient.post(`/school_dashboard/macroplanner/`, plannerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating macro planner:", error);
    return { success: false, error: handleError(error, "Failed to create macro planner.") };
  }
};

// **Fetch Micro Planner**
export const fetchMicroPlanner = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/microplanner/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching micro planner:", error);
    return { success: false, error: handleError(error, "Failed to fetch micro planner.") };
  }
};

// **Create Micro Planner**
export const createMicroPlanner = async (plannerData) => {
  try {
    const response = await apiClient.post(`/school_dashboard/microplanner/`, plannerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating micro planner:", error);
    return { success: false, error: handleError(error, "Failed to create micro planner.") };
  }
};

// **Fetch Monthly Report**
export const fetchMonthlyReport = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/monthlyreport/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching monthly report:", error);
    return { success: false, error: handleError(error, "Failed to fetch monthly report.") };
  }
};

// **Create Monthly Report**
export const createMonthlyReport = async (reportData) => {
  try {
    const response = await apiClient.post(`/school_dashboard/monthlyreport/`, reportData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating monthly report:", error);
    return { success: false, error: handleError(error, "Failed to create monthly report.") };
  }
};

// **Fetch Student Access Report**
export const fetchStudentAccessReport = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/school_dashboard/student_access_report/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching student access report:", error);
    return { success: false, error: handleError(error, "Failed to fetch student access report.") };
  }
};

// **Fetch School Gallery**
export const fetchSchoolGallery = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/schoolgallery/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching school gallery:", error);
    return { success: false, error: handleError(error, "Failed to fetch school gallery.") };
  }
};

// **Fetch Schoolwise Curriculum**
export const fetchSchoolwiseCurriculum = async () => {
  try {
    const response = await apiClient.get(`/school_dashboard/schoolwisecurriculum/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching schoolwise curriculum:", error);
    return { success: false, error: handleError(error, "Failed to fetch schoolwise curriculum.") };
  }
};

// **Fetch School Dashboard by Username**
export const fetchSchoolDashboardByUsername = async (username) => {
  try {
    const response = await apiClient.get(`/school_dashboard/${username}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching school dashboard:", error);
    return { success: false, error: handleError(error, "Failed to fetch school dashboard.") };
  }
};