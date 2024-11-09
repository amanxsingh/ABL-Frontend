import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProfileForm from "./ProfileSetting";
import "./Dashboardcontent.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Card from "../UIcomponents/card";
import { fetchStudentDashboard } from "../apiservice";
import { propTypes } from "react-bootstrap/esm/Image";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated !== "true") {
          window.location.href = "/login"; // Redirect to login if not authenticated
        } else {
          const result = await fetchStudentDashboard(username); // Pass username to the API call
          if (result.success) {
            setData(result.data); // Store the data in state
          } else {
            setError(result.error || "An error occurred while fetching data.");
          }
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, isAuthenticated]);

  if (error) {
    return <div>{error}</div>; // Display error if there is any
  }

  if (loading) {
    return <p>Loading data, please wait...</p>; // Show loading message while data is being fetched
  }

  return data ? <Dashboardcontent data={data} /> : <p>No data available.</p>; // Pass data to Dashboardcontent
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
                  <div key={index}>
                    <Link
                      to={`/learning/${data.profile.grade}/${subject.slug}/`}
                    >
                      <Card
                        title={subject.name}
                        description={
                          subject.description || "No description available."
                        }
                        image={
                          subject.image || "https://via.placeholder.com/150"
                        }
                        logo="path/to/logo.png"
                      />
                    </Link>
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
            <span className="button-text">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="content-panel">{renderContent()}</div>
    </div>
  );
};

Dashboardcontent.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.arrayOf(
      PropTypes.shape({
        grade: PropTypes.string.isRequired,
      })
    ),
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        description: PropTypes.string,
        Standard: PropTypes.string,
        slug: PropTypes.string,
      })
    ),
  }),
};

export default DashboardPage;
