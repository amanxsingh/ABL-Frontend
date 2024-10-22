import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProfileForm from "./ProfileSetting"; // Assuming ProfileForm is a separate component
import "./Dashboardcontent.css"; // Custom CSS for the layout
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap icons

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const username = localStorage.getItem("username"); // Fetch username from localStorage
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Check if user is authenticated

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated !== "true") {
          // Redirect to login if not authenticated
          window.location.href = "/login";
        } else {
          const response = await fetch(
            `http://192.168.1.34:8000/student_dashboard/${username}/`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
                Authorization: "Basic c3R1ZGVudDE6cGFzc3dvcmQxMjM0", // Basic auth credentials
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setData(data);
          } else {
            setError("Error fetching data.");
            console.error("Error fetching dashboard data:", response.status);
          }
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("An error occurred:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, isAuthenticated]);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <p>Loading data, please wait...</p>;
  }

  return data ? <Dashboardcontent data={data} /> : <p>No data available.</p>;
};

const Dashboardcontent = ({ data }) => {
  const [activeContent, setActiveContent] = useState("subjects");

  const renderContent = () => {
    switch (activeContent) {
      case "subjects":
        return (
          <div className="subject-cards-container">
            {data.subjects && Array.isArray(data.subjects)
              ? data.subjects.map((subject, index) => (
                  <div className="card" key={index}>
                    <img
                      src={subject.image || "https://via.placeholder.com/150"}
                      className="card-img-top"
                      alt={subject.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{subject.name}</h5>
                      <p className="card-text">
                        {subject.description || "No description available."}
                      </p>
                    </div>
                  </div>
                ))
              : "No subjects available."}
          </div>
        );
      case "progress":
        return <div>Progress Report content here...</div>;
      case "assessment":
        return <div>Assessment Report content here...</div>;
      case "quizzes":
        return <div>Quizzes & Assessments content here...</div>;
      case "projects":
        return <div>Innovative Projects content here...</div>;
      case "events":
        return <div>Upcoming Events content here...</div>;
      case "profileSetting":
        return <ProfileForm onClose={() => setActiveContent("subjects")} />;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="button-panel">
        {[
          { label: "Subjects", key: "subjects" },
          { label: "Progress Report", key: "progress" },
          { label: "Assessment Report", key: "assessment" },
          { label: "Quizzes & Assessments", key: "quizzes" },
          { label: "Innovative Projects", key: "projects" },
          { label: "Upcoming Events", key: "events" },
          { label: "Profile Setting", key: "profileSetting" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            className={`btn ${
              activeContent === item.key
                ? "btn-secondary"
                : "btn-outline-secondary"
            }`}
            onClick={() => setActiveContent(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="content-panel">{renderContent()}</div>
    </div>
  );
};

// Prop types validation for Dashboardcontent component
Dashboardcontent.propTypes = {
  data: PropTypes.shape({
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string, // Adjust based on API response
        description: PropTypes.string,
      })
    ),
  }),
};

export default DashboardPage;
