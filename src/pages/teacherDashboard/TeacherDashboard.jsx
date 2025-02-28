import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  fetchTeacherDashboard,
  fetchInnovationClub,
  fetchInventory,
  fetchKreativityShow,
  fetchMacroPlanner,
  fetchMicroPlanner,
  fetchMonthlyReports,
  fetchStudentAccessReport,
  notifyStudents,
} from "../../api/teacherApiService";
import { logout } from "../../api/apiservice";
import "../../utils/css/sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "../../UIcomponents/dashboard/loader";
import TeacherDashboardContent from "./TeacherDashboardContent";
import InnovationClub from "./InnovationClub";
import Inventory from "./Inventory";
import KreativityShow from "./KreativityShow";
import MacroPlanner from "./MacroPlanner";
import MicroPlanner from "./MicroPlanner";
import MonthlyReport from "./MonthlyReport";
import AdvocacyReport from "./AdvocacyReport";
import ClassroomGallery from "./ClassroomGallery";
import LearnersAssigned from "./LearnersAssigned";
import StudentReport from "./StudentReport";

const TeacherDashboard = () => {
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
        const result = await fetchTeacherDashboard(username);
        if (result.success) {
          setData(result.data);
        } else {
          setError("An error occurred while fetching teacher dashboard data.");
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
        return <TeacherDashboardContent />;
      case "innovationClub":
        return <InnovationClub />;
      case "inventory":
        return <Inventory />;
      case "kreativityShow":
        return <KreativityShow />;
      case "macroPlanner":
        return <MacroPlanner />;
      case "microPlanner":
        return <MicroPlanner />;
      case "monthlyReports":
        return <MonthlyReport />;
      case "advocacyReport":
        return <AdvocacyReport />;
      case "classroomGallery":
        return <ClassroomGallery />;
      case "learnersAssigned":
        return <LearnersAssigned />;
      case "studentReport":
        return <StudentReport />;
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
          <img
            src={data?.profile?.user?.profile_pic || "https://via.placeholder.com/80"}
            alt="Profile"
            className="profile-image"
          />
          {!isCollapsed && (
            <div className="profile-info">
              <div className="profile-name">{data?.profile?.user?.username}</div>
            </div>
          )}
        </div>
        <div className="sidebar-content">
          {[
            { label: "Dashboard", key: "dashboard", icon: "bi-house" },
            { label: "Innovation Club", key: "innovationClub", icon: "bi-lightbulb" },
            { label: "Inventory", key: "inventory", icon: "bi-box" },
            { label: "Kreativity Show", key: "kreativityShow", icon: "bi-camera-reels" },
            { label: "Macro Planner", key: "macroPlanner", icon: "bi-calendar" },
            { label: "Micro Planner", key: "microPlanner", icon: "bi-calendar-check" },
            { label: "Monthly Reports", key: "monthlyReports", icon: "bi-file-earmark-text" },
            { label: "Advocacy Report", key: "advocacyReport", icon: "bi-file-earmark" },
            { label: "Classroom Gallery", key: "classroomGallery", icon: "bi-images" },
            { label: "Learners Assigned", key: "learnersAssigned", icon: "bi-people" },
            { label: "Student Report", key: "studentReport", icon: "bi-file-earmark-bar-graph" },
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

TeacherDashboard.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      user: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        profile_pic: PropTypes.string,
      }),
    }),
  }),
};

export default TeacherDashboard;
