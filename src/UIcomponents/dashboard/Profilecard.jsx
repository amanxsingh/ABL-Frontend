import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchStudentDashboard, fetchStudentNotifications } from "../../api/apiservice";
import "./profilecard.css";
import Social from "./Social";
import Loader from "./loader";
import PerformanceChart from "./PerformanceChart";
import Linegraph from "./Linegraph";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProfileCard = ({ username }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = localStorage.getItem("isAuthenticated");

  useEffect(() => {
    const loadDashboardData = async () => {
      if (isAuthenticated !== "true") {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchStudentDashboard(username);
        if (response.success) {
          setData(response.data);
        } else {
          setError("Failed to fetch dashboard data.");
        }
      } catch {
        setError("An error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (username) loadDashboardData();
  }, [username, isAuthenticated]);

  if (loading) return <p>Loading...</p>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-card">
      <img
        src="https://images.unsplash.com/photo-1723384747376-90f201a3bd55?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="background-pic"
        alt="Background"
      />
      <img
        src={data?.profile?.profile_pic || "https://via.placeholder.com/80"}
        alt="Profile"
        className="profile-pic"
      />
      <h4>{data?.profile?.name || "Student"}</h4>
      <p className="location">Class - {data?.profile?.grade}</p>
      <div className="stats">
        <div className="stat">
          <p>{data?.courses?.length || 2}</p>
          <span>Course</span>
        </div>
        <div className="stat">
          <p>{data?.certifications?.length || 1}</p>
          <span>Certification</span>
        </div>
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  username: PropTypes.string.isRequired,
};

const ActionCards = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchStudentNotifications();
        if (response.success) {
          setNotifications(response.data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    loadNotifications();
  }, []);

  return (
    <div className="action-cards">
      <div className="action-card set-target1">
        <div className="icon-heading">
          <i className="bi bi-bell-fill icon"></i>
          <h4>Notifications ({notifications.length})</h4>
        </div>
        <div className="header-con1">
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li key={index}>{notification.message}</li>
              ))
            ) : (
              <li>No new notifications</li>
            )}
          </ul>
        </div>
      </div>
      <div className="action-card set-target">
        <div className="icon-heading">
          <i className="bi bi-bullseye icon"></i>
          <h4>Teachers Comment</h4>
        </div>
        <div className="header-con">
          <ul>
            <li>Your performance is steady, showing a good understanding of the basics.</li>
            <li>Keep up the good work and continue to practice.</li>
            <li>Keep up the good work and continue to practice.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const LeftContainer = ({ data }) => {
  return (
    <div className="left-container">
      <h1>
        <b>Hello, </b>
        {data?.profile?.name || "Student"}
      </h1>
      <h6>Nice to have you back, what an exciting day!</h6>
      <h6>Get ready and continue your lessons today.</h6>
      <h2>Your Performance</h2>
      <PerformanceChart />
      <div className="bottom-card">
        <Social />
      </div>
    </div>
  );
};

LeftContainer.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      name: PropTypes.string,
      profile_pic: PropTypes.string,
      grade: PropTypes.string,
    }),
    courses: PropTypes.arrayOf(PropTypes.object),
    certifications: PropTypes.arrayOf(PropTypes.object),
  }),
};

const LearningActivity = () => (
  <div className="learning-activity">
    <h3>Learning Activity</h3>
    <div className="chart">
      <Linegraph />
    </div>
  </div>
);

const DashboardCard = () => {
  const username = localStorage.getItem("username") || "";
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      const response = await fetchStudentDashboard(username);
      if (response.success) {
        setData(response.data);
      }
    };
    if (username) loadDashboardData();
  }, [username]);

  return (
    <div className="dashboard-container">
      <LeftContainer data={data} />
      <div className="right-container">
        <div className="top-section">
          <ProfileCard username={username} />
          <ActionCards />
        </div>
        <LearningActivity />
      </div>
    </div>
  );
};

export default DashboardCard;
