import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  fetchSchoolDashboard,
  fetchAdvocacyReport,
  fetchHomeworkReports,
  fetchInnovationClub,
  fetchInventory,
  fetchKreativityShow,
  fetchLeaderboard,
  fetchMacroPlanner,
  fetchMicroPlanner,
  fetchMonthlyReport,
  fetchSchoolGallery,
  fetchSchoolwiseCurriculum,
  logout,
} from "../../api/apiservice";
import "../../utils/css/sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "../../UIcomponents/dashboard/loader";
import StudentAccessReport from "./StudentAccessReport";

const SchoolDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (isAuthenticated !== "true") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const result = await fetchSchoolDashboard(username);
        if (result.success) {
          setData(result.data);
        } else {
          setError("An error occurred while fetching school dashboard data.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchData();
  }, [username, navigate]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      localStorage.clear();
      navigate("/login");
    } else {
      setError("Logout failed.");
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return (
          <div>
            <h2>School Dashboard</h2>
            <p><strong>Username:</strong> {data?.profile?.user?.username}</p>
            <p><strong>Email:</strong> {data?.profile?.user?.email}</p>
            <p><strong>Role:</strong> {data?.profile?.user?.role}</p>
            <p><strong>School:</strong> {data?.profile?.school}</p>
          </div>
        );
      case "advocacyReport":
        return <FetchDataContent fetchFunction={fetchAdvocacyReport} title="Advocacy Report" />;
      case "homeworkReports":
        return <FetchDataContent fetchFunction={fetchHomeworkReports} title="Homework Reports" />;
      case "innovationClub":
        return <FetchDataContent fetchFunction={fetchInnovationClub} title="Innovation Club" />;
      case "inventory":
        return <FetchDataContent fetchFunction={fetchInventory} title="Inventory" />;
      case "kreativityShow":
        return <FetchDataContent fetchFunction={fetchKreativityShow} title="Kreativity Show" />;
      case "leaderboard":
        return <FetchDataContent fetchFunction={fetchLeaderboard} title="Leaderboard" />;
      case "macroPlanner":
        return <FetchDataContent fetchFunction={fetchMacroPlanner} title="Macro Planner" />;
      case "microPlanner":
        return <FetchDataContent fetchFunction={fetchMicroPlanner} title="Micro Planner" />;
      case "monthlyReport":
        return <FetchDataContent fetchFunction={fetchMonthlyReport} title="Monthly Report" />;
      case "studentAccessReport":
        return <StudentAccessReport />;
      case "schoolGallery":
        return <FetchDataContent fetchFunction={fetchSchoolGallery} title="School Gallery" />;
      case "schoolwiseCurriculum":
        return <FetchDataContent fetchFunction={fetchSchoolwiseCurriculum} title="Schoolwise Curriculum" />;
      default:
        return <div>Select an option</div>;
    }
  };

  const FetchDataContent = ({ fetchFunction, title }) => {
    const [contentData, setContentData] = useState(null);
    const [contentLoading, setContentLoading] = useState(true);
    const [contentError, setContentError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        setContentLoading(true);
        try {
          const result = await fetchFunction();
          if (result.success) {
            setContentData(result.data);
          } else {
            setContentError(`An error occurred while fetching ${title.toLowerCase()} data.`);
          }
        } catch (error) {
          setContentError(`An error occurred while fetching ${title.toLowerCase()} data.`);
        } finally {
          setContentLoading(false);
        }
      };

      fetchData();
    }, [fetchFunction, title]);

    if (contentLoading) return <Loader />;
    if (contentError) return <div>{contentError}</div>;

    return (
      <div>
        <h2>{title}</h2>
        <pre>{JSON.stringify(contentData, null, 2)}</pre>
      </div>
    );
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="sidebar-profile">
          {!isCollapsed && (
            <div className="profile-info">
              <div className="profile-name">{data?.profile?.user?.username}</div>
              <div className="profile-grade">{data?.profile?.school}</div>
            </div>
          )}
        </div>

        <div className="sidebar-content">
          {[
            { label: "Dashboard", key: "dashboard", icon: "bi-house" },
            { label: "Advocacy Report", key: "advocacyReport", icon: "bi-file-earmark-text" },
            { label: "Homework Reports", key: "homeworkReports", icon: "bi-journal" },
            { label: "Innovation Club", key: "innovationClub", icon: "bi-lightbulb" },
            { label: "Inventory", key: "inventory", icon: "bi-box" },
            { label: "Kreativity Show", key: "kreativityShow", icon: "bi-tv" },
            { label: "Leaderboard", key: "leaderboard", icon: "bi-trophy" },
            { label: "Macro Planner", key: "macroPlanner", icon: "bi-calendar" },
            { label: "Micro Planner", key: "microPlanner", icon: "bi-calendar3" },
            { label: "Monthly Report", key: "monthlyReport", icon: "bi-calendar2" },
            { label: "Student Access Report", key: "studentAccessReport", icon: "bi-graph-up" },
            { label: "School Gallery", key: "schoolGallery", icon: "bi-images" },
            { label: "Schoolwise Curriculum", key: "schoolwiseCurriculum", icon: "bi-book" },
          ].map((item) => (
            <div
              key={item.key}
              className={`sidebar-item ${activeContent === item.key ? "active" : ""}`}
              onClick={() => setActiveContent(item.key)}
            >
              <i className={`bi ${item.icon} sidebar-icon`}></i>
              {!isCollapsed && <span className="sidebar-text">{item.label}</span>}
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

SchoolDashboard.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      user: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
      school: PropTypes.string,
    }),
  }),
};

export default SchoolDashboard;
