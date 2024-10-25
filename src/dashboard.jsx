import { useEffect, useState } from "react";
// import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import DashboardPage from "./Components/Dashboardcontent";
// import "./dashboard.css";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Retrieve authentication status and username from localStorage
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated !== "true") {
          // If not authenticated, redirect to login page
          navigate("/login");
        } else {
          const response = await fetch(
            `http://192.168.1.12:8000/student_dashboard/${username}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic c3R1ZGVudDE6cGFzc3dvcmQxMjM0", // Use your basic auth credentials
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          } else {
            console.error("Failed to fetch dashboard data:", response.status);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <DashboardPage />
      <h1>Welcome, {dashboardData.profile.name}!</h1>
      {/* Render other dashboard data */}
    </div>
  );
};

export default StudentDashboard;
