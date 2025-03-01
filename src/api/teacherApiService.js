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
  try {
    const response = await apiClient.get("/inventory/");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createInventory = async (component) => {
  try {
    const response = await apiClient.post("/inventory/", component);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateInventory = async (component) => {
  try {
    const response = await apiClient.patch(`/inventory/${component.id}/`, component);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteInventory = async (id) => {
  try {
    const response = await apiClient.delete(`/inventory/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
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
  try {
    const response = await apiClient.get("/macroplanner/");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addMacroPlanner = async (planner) => {
  try {
    const formData = new FormData();
    formData.append("grade", planner.grade);
    formData.append("school", planner.school);
    formData.append("file", planner.file);

    const response = await apiClient.post("/macroplanner/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateMacroPlanner = async (planner) => {
  try {
    const formData = new FormData();
    formData.append("grade", planner.grade);
    formData.append("school", planner.school);
    formData.append("file", planner.file);

    const response = await apiClient.patch(`/macroplanner/${planner.id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteMacroPlanner = async (id) => {
  try {
    const response = await apiClient.delete(`/macroplanner/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchMicroPlanner = async () => {
  try {
    const response = await apiClient.get("/microplanner/");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addMicroPlanner = async (planner) => {
  try {
    const formData = new FormData();
    formData.append("month", planner.month);
    formData.append("school", planner.school);
    formData.append("microplanner", planner.microplanner);

    const response = await apiClient.post("/microplanner/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateMicroPlanner = async (planner) => {
  try {
    const formData = new FormData();
    formData.append("month", planner.month);
    formData.append("school", planner.school);
    formData.append("microplanner", planner.microplanner);

    const response = await apiClient.patch(`/microplanner/${planner.id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteMicroPlanner = async (id) => {
  try {
    const response = await apiClient.delete(`/microplanner/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
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

export const updateMonthlyReport = async (data) => {
  return apiClient.put(`/monthlyreports/${data.id}/`, data)
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

export const fetchHomeworkReport = async () => {
  return apiClient.get("/homework_report/")
    .then(response => ({ success: true, data: response.data }))
    .catch(error => ({ success: false, error }));
};

export const fetchAdvocacyReport = async () => {
  try {
    const response = await apiClient.get("/advocacyreport/");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

