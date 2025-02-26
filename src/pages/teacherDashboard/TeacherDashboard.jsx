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
        return (
          <div>
            <h2>Teacher Dashboard</h2>
            <p><strong>Username:</strong> {data?.profile?.user?.username}</p>
            <p><strong>Email:</strong> {data?.profile?.user?.email}</p>
            <p><strong>Role:</strong> {data?.profile?.user?.role}</p>
          </div>
        );
      case "innovationClub":
        return <FetchDataContent fetchFunction={fetchInnovationClub} title="Innovation Club" />;
      case "inventory":
        return <FetchDataContent fetchFunction={fetchInventory} title="Inventory" />;
      case "kreativityShow":
        return <FetchDataContent fetchFunction={fetchKreativityShow} title="Kreativity Show" />;
      case "macroPlanner":
        return <FetchDataContent fetchFunction={fetchMacroPlanner} title="Macro Planner" />;
      case "microPlanner":
        return <FetchDataContent fetchFunction={fetchMicroPlanner} title="Micro Planner" />;
      case "monthlyReports":
        return <FetchDataContent fetchFunction={fetchMonthlyReports} title="Monthly Reports" />;
      case "studentAccessReport":
        return <FetchDataContent fetchFunction={fetchStudentAccessReport} title="Student Access Report" />;
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
        <div className="sidebar-content">
          {["dashboard", "innovationClub", "inventory", "kreativityShow", "macroPlanner", "microPlanner", "monthlyReports", "studentAccessReport"].map((item) => (
            <div
              key={item}
              className={`sidebar-item ${activeContent === item ? "active" : ""}`}
              onClick={() => setActiveContent(item)}
            >
              <span className="sidebar-text">{item}</span>
            </div>
          ))}
        </div>
        <div className="logout-section">
          <div className="sidebar-item" onClick={handleLogout}>
            <span className="sidebar-text">Logout</span>
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
      }),
    }),
  }),
};

export default TeacherDashboard;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchTeacherDashboard } from "../../api/teacherApiService";
// import Loader from "../../UIcomponents/dashboard/loader";

// const TeacherDashboard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const username = localStorage.getItem("username") || "";
//   const isAuthenticated = localStorage.getItem("isAuthenticated");

//   useEffect(() => {
//     if (isAuthenticated !== "true") {
//       navigate("/login");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const result = await fetchTeacherDashboard(username);
//         if (result.success) {
//           setData(result.data);
//         } else {
//           setError("Failed to fetch teacher dashboard data.");
//         }
//       } catch {
//         setError("Error fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (username) fetchData();
//   }, [username, navigate]);

//   if (loading) return <Loader />;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h2>Teacher Dashboard</h2>
//       <p><strong>Username:</strong> {data?.profile?.user?.username}</p>
//       <p><strong>Email:</strong> {data?.profile?.user?.email}</p>
//       <p><strong>Role:</strong> {data?.profile?.user?.role}</p>
//     </div>
//   );
// };

// export default TeacherDashboard ;
