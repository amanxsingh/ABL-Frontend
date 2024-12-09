import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import ProfileForm from "./Components/ProfileSetting";
import Card from "./UIcomponents/card";
import { fetchStudentDashboard, logout } from "./apiservice";
import "./sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Profilecard from "./UIcomponents/Profilecard";
import Loader from "./UIcomponents/loader";

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated !== "true") {
        navigate("/login");
      } else {
        try {
          const result = await fetchStudentDashboard(username);
          result.success
            ? setData(result.data)
            : setError("An error occurred.");
        } catch {
          setError("An error occurred while fetching data.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (username) fetchData();
  }, [username, isAuthenticated, navigate]);

  const handleLogout = async () => {
    const result = await logout();
    result.success ? navigate("/LoginPage") : setError("Logout failed.");
  };

  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return (
          <div className="maindash">
            <Profilecard />
          </div>
        );
      case "subjects":
        return (
          <div className="subject-cards-container">
            {data?.subjects?.map((subject, index) => (
              <div key={index}>
                <Link to={`/learning/${data.profile.grade}/${subject.slug}/`}>
                  <Card
                    title={subject.name}
                    image={subject.image}
                    description={
                      subject.description || "No description available."
                    }
                  />
                </Link>
              </div>
            )) || "No subjects available."}
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

  if (loading)
    return (
      <p>
        <Loader />
      </p>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="sidebar-profile">
          <img
            src={data?.profile?.profile_pic || "https://via.placeholder.com/80"}
            alt="Profile"
            className="profile-image"
          />
          {!isCollapsed && (
            <div className="profile-info">
              <div className="profile-name">{data?.profile?.name}</div>
              <div className="profile-grade">
                Class - {data?.profile?.grade}
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-content">
          {[
            { label: "Dashboard", key: "dashboard", icon: "bi-house" },
            { label: "Subjects", key: "subjects", icon: "bi-book" },
            { label: "Progress Report", key: "progress", icon: "bi-graph-up" },
            {
              label: "Assessment Report",
              key: "assessment",
              icon: "bi-check2-square",
            },
            {
              label: "Quizzes & Assessments",
              key: "quizzes",
              icon: "bi-question-circle",
            },
            {
              label: "Innovative Projects",
              key: "projects",
              icon: "bi-lightbulb",
            },
            {
              label: "Upcoming Events",
              key: "events",
              icon: "bi-calendar-event",
            },
            {
              label: "Profile Setting",
              key: "profileSetting",
              icon: "bi-gear",
            },
          ].map((item) => (
            <div
              key={item.key}
              className={`sidebar-item ${
                activeContent === item.key ? "active" : ""
              }`}
              onClick={() => setActiveContent(item.key)}
            >
              <i className={`bi ${item.icon} sidebar-icon`}></i>
              {!isCollapsed && (
                <span className="sidebar-text">{item.label}</span>
              )}
            </div>
          ))}
        </div>

        <div className="logout-section">
          <div className="sidebar-item" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right sidebar-icon"></i>
            {!isCollapsed && <span className="sidebar-text">Logout</span>}
          </div>
        </div>
      </div>

      <div className="content-panel">{renderContent()}</div>
    </div>
  );
};

StudentDashboard.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      grade: PropTypes.string.isRequired,
      name: PropTypes.string,
      profile_pic: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }),
    }),
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        description: PropTypes.string,
        slug: PropTypes.string,
      })
    ),
  }),
};

export default StudentDashboard;
