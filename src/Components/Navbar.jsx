import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProfileForm from "./ProfileSetting"; // Assuming ProfileForm is a separate component
import "bootstrap-icons/font/bootstrap-icons.css";
import BellButton from "../UIcomponents/bell";
import "./navbar.css";
import Learning from "../learning";
import { Link } from "react-router-dom";
import { fetchStudentDashboard, logout } from "../apiservice"; // Import the service

const Navbar = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false); // State to show/hide profile form
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || ""; // Fetch username from localStorage
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Check if user is authenticated

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated !== "true") {
          // Redirect to login page if not authenticated
          navigate("/login");
        } else {
          const result = await fetchStudentDashboard(username); // Use the new fetch function
          if (result.success) {
            setData(result.data); // Set data if the fetch is successful
          } else {
            setError(result.error); // Set error if something goes wrong
            console.error("Error fetching dashboard data:", result.error);
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
  }, [username, isAuthenticated, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to handle logout using apiService
  const handleLogout = async () => {
    const result = await logout(); // Use the logout function from apiService.js

    if (result.success) {
      navigate("/LoginPage"); // Redirect to login page on successful logout
    } else {
      setError(result.error); // Show error message if logout fails
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a className="navbar-brand" href="/">
          <img
            src="\src\assets\pictures\abl_lms.jpg"
            alt="Logo"
            className="brand-logo"
          />
        </a>

        <div className="welcome-container">
          {data && data.profile ? (
            <h1 className="welcome-message">
              Welcome, {data.profile.name} - Class {data.profile.grade}
            </h1>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="navbar-links">
          <Link to="/learning" className="nav-link">
            <BellButton />
          </Link>

          <Dropdown>
            <Dropdown.Toggle
              variant="none"
              id="dropdown-basic"
              className="dropdown-toggle"
            >
              <img
                src={
                  data.profile.profile_pic || "https://via.placeholder.com/40"
                }
                alt="Profile"
                className="profile-image"
              />
              <span>{data.profile.user.username}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => setShowProfileForm(true)}>
                Profile Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Conditionally render ProfileForm when 'Profile Settings' is clicked */}
      {showProfileForm && (
        <ProfileForm
          username={data.profile.user.username}
          onClose={() => setShowProfileForm(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
