// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import { fetchSchoolDashboard, logout } from "./apiservice";
// import "./sidebar.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import Loader from "./UIcomponents/loader";

// const SchoolDashboard = () => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isCollapsed, setIsCollapsed] = useState(true);
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
//         const result = await fetchSchoolDashboard(username);
//         if (result.success) {
//           setData(result.data);
//         } else {
//           setError("An error occurred while fetching school dashboard data.");
//         }
//       } catch (error) {
//         setError("An error occurred while fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (username) fetchData();
//   }, [username, navigate]);

//   const handleLogout = async () => {
//     const result = await logout();
//     if (result.success) {
//       localStorage.clear();
//       navigate("/login");
//     } else {
//       setError("Logout failed.");
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="dashboard">
//       <div
//         className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
//         onMouseEnter={() => setIsCollapsed(false)}
//         onMouseLeave={() => setIsCollapsed(true)}
//       >
//         <div className="sidebar-profile">
//           {!isCollapsed && (
//             <div className="profile-info">
//               <div className="profile-name">{data?.profile?.user?.username}</div>
//               <div className="profile-grade">{data?.profile?.school}</div>
//             </div>
//           )}
//         </div>
//         <div className="logout-section">
//           <div className="sidebar-item" onClick={handleLogout}>
//             <i className="bi bi-box-arrow-right sidebar-icon"></i>
//             {!isCollapsed && <span className="sidebar-text">Logout</span>}
//           </div>
//         </div>
//       </div>

//       <div className="content-panel">
//         <h2>School Dashboard</h2>
//         <p><strong>Username:</strong> {data?.profile?.user?.username}</p>
//         <p><strong>Email:</strong> {data?.profile?.user?.email}</p>
//         <p><strong>Role:</strong> {data?.profile?.user?.role}</p>
//         <p><strong>School:</strong> {data?.profile?.school}</p>
//       </div>
//     </div>
//   );
// };

// SchoolDashboard.propTypes = {
//   data: PropTypes.shape({
//     profile: PropTypes.shape({
//       user: PropTypes.shape({
//         username: PropTypes.string,
//         email: PropTypes.string,
//         role: PropTypes.string,
//       }),
//       school: PropTypes.string,
//     }),
//   }),
// };

// export default SchoolDashboard;


import { useEffect, useState } from "react";
import { fetchSchoolDashboard } from "./apiservice";

const SchoolDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchSchoolDashboard(username);
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    };
    if (username) fetchData();
  }, [username]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>School Dashboard</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SchoolDashboard;
