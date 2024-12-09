import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchStudentDashboard } from "../apiservice";
import "./profilecard.css";
import Social from "./Social";
import Loader from "./loader";

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
          setData(response.data); // Store the entire data object
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
          <p>{data?.courses?.length || 0}</p>
          <span>Course</span>
        </div>
        <div className="stat">
          <p>{data?.certifications?.length || 0}</p>
          <span>Certification</span>
        </div>
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  username: PropTypes.string.isRequired,
};

const ActionCards = () => (
  <div className="action-cards">
    {/* Top card */}
    {/* <div className="action-card consultation">
      <div className="header-con">
        <img
          src="https://images.unsplash.com/photo-1723384747376-90f201a3bd55?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Icon"
          className="img1"
        />
        <div className="header-con3">
          <h4>
            <b>CONSULTATION</b>
          </h4>
          <h6>Points</h6>
          <button className="btn1">Hello1</button>
          <button className="btn2">Hello</button>
        </div>
      </div> 
    </div> */}

    {/* Bottom cards */}
    <div className="action-cards-row">
      <div className="action-card set-target1">
        <div className="header-con1">
          <img src="icon: bi-house" alt="Icon" className="icon" />
          <h4>Set Target 2</h4>
        </div>
      </div>
      <div className="action-card set-target">
        <div className="header-con">
          <img src="icon: bi-house" alt="Icon" className="icon" />
          <h4>Set Target 1</h4>
        </div>
      </div>
    </div>
  </div>
);

const LeftContainer = ({ data }) => (
  <div className="left-container">
    <h1>
      <b>Hello, </b>
      {data?.profile?.name || "Student"}
    </h1>
    <h6>Nice to have you back, what an exciting day!</h6>{" "}
    <h6> Get ready and continue your lessons today.</h6>
    <h2>Your Performance</h2>
    <div className="chart-section">
      {/* Replace with an actual chart later */}
      <div className="chart-placeholder">Chart Placeholder</div>
    </div>
    <div className="bottom-card">
      <Social />
    </div>
  </div>
);

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
      {/* Placeholder for chart */}
      <p>Chart Placeholder</p>
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
