import axios from "axios";

const BASE_URL = "https://mechanzo.com/teacher_dashboard";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

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


  

export const fetchTeacherDashboard = async (username) => {
  return apiClient.get(`/${username}/`)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchInnovationClub = async () => {
  return apiClient.get("/innovationclub/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const createInnovationClub = async (data) => {
  return apiClient.post("/innovationclub/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const updateInnovationClub = async (data) => {
  return apiClient.patch("/innovationclub/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchInventory = async () => {
  return apiClient.get("/inventory/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const createInventory = async (data) => {
  return apiClient.post("/inventory/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const updateInventory = async (data) => {
  return apiClient.patch("/inventory/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const deleteInventory = async () => {
  return apiClient.delete("/inventory/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchKreativityShow = async () => {
  return apiClient.get("/kreativityshow/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const createKreativityShow = async (data) => {
  return apiClient.post("/kreativityshow/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchMacroPlanner = async () => {
  return apiClient.get("/macroplanner/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const createMacroPlanner = async (data) => {
  return apiClient.post("/macroplanner/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const updateMacroPlanner = async (data) => {
  return apiClient.put("/macroplanner/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const deleteMacroPlanner = async () => {
  return apiClient.delete("/macroplanner/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchMicroPlanner = async () => {
  return apiClient.get("/microplanner/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const createMicroPlanner = async (data) => {
  return apiClient.post("/microplanner/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const updateMicroPlanner = async (data) => {
  return apiClient.put("/microplanner/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const deleteMicroPlanner = async () => {
  return apiClient.delete("/microplanner/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchMonthlyReports = async () => {
  return apiClient.get("/monthlyreports/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchMonthlyReportById = async (id) => {
  return apiClient.get(`/monthlyreports/${id}/`)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const createMonthlyReport = async (data) => {
  return apiClient.post("/monthlyreports/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const deleteMonthlyReport = async (id) => {
  return apiClient.delete(`/monthlyreports/${id}/`)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchStudentAccessReport = async () => {
  return apiClient.get("/student_access_report/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const notifyStudents = async (data) => {
  return apiClient.post("/notify_students/", data)
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

