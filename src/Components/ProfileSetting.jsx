import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const ProfileForm = ({ onClose }) => {
  const [profileData, setProfileData] = useState(null); // Initially null to handle loading
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `http://192.168.1.9:8000/student-profile/${username}/`, // Use dynamic username from props
            {
              method: "GET",
              headers: {
                accept: "application/json",
                Authorization: "Basic c3R1ZGVudDE6cGFzc3dvcmQxMjM0", // Use your basic auth credentials
              },
            }
          );

          const profile = response.data;
          console.log("Fetched Data:", profile);
          setProfileData(profile);
        } else {
          setError("Username not provided.");
        }
      } catch (err) {
        setError("Error fetching profile data.");
        console.error("An error occurred:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="profile-form">
      <h2>User Profile</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={profileData.user?.username || ""}
            className="form-control"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.user?.email || ""}
            className="form-control"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name || ""}
            className="form-control"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade</label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={profileData.grade || ""}
            className="form-control"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="section">Section</label>
          <input
            type="text"
            id="section"
            name="section"
            value={profileData.section || ""}
            className="form-control"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="school">School</label>
          <input
            type="text"
            id="school"
            name="school"
            value={profileData.school || ""}
            className="form-control"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile_pic">Profile Picture</label>
          {profileData.profile_pic ? (
            <img
              src={profileData.profile_pic}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            />
          ) : (
            <p>No profile picture available</p>
          )}
        </div>

        {/* Save and Close buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => console.log("Save clicked")}
          >
            Save
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

ProfileForm.propTypes = {
  username: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileForm;
