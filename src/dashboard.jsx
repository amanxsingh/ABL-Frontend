// src/StudentDashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import DashboardPage from "./Components/Dashboardcontent";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const username = localStorage.getItem("username");
  console.log("Username from localStorage:", username);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated !== "true") {
          navigate("/login");
        } else {
          const response = await fetch(
            `http://192.168.1.12:8000/student_dashboard/${username}/`, // Use proxy prefix `/api`
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Basic c3R1ZGVudDE6cGFzc3dvcmQxMjM0",
              },
              mode: "cors", // Ensure CORS handling
            }
          );

          // Check if the response is JSON
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error("Non-JSON response received:", await response.text());
            throw new Error("Server returned non-JSON response");
          }

          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          } else {
            setError(`Error: ${response.status}`);
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <DashboardPage />
      <h1>Welcome, {dashboardData && dashboardData.profile.name}!</h1>
      {/* Render other dashboard data if available */}
    </div>
  );
};

export default StudentDashboard;
