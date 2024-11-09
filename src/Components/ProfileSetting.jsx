import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchStudentProfile } from "../apiservice"; // Import the new API function

const ProfileForm = ({ onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const loadProfileData = async () => {
      if (!username) {
        setError("Username not provided.");
        setLoading(false);
        return;
      }

      const result = await fetchStudentProfile(username);
      if (result.success) {
        setProfileData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    loadProfileData();
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
  onClose: PropTypes.func.isRequired,
};

export default ProfileForm;
