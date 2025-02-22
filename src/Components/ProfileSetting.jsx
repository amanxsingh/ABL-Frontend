import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchStudentProfile, updateStudentAvatar, patchStudentProfile } from "../api/apiservice";

const ProfileForm = ({ onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const profilePayload = {
        name: profileData.name,
        grade: profileData.grade,
        section: profileData.section,
      };

      console.log("Profile Payload:", profilePayload);

      const result = await patchStudentProfile(username, profilePayload);

      if (result.success) {
        alert("Profile updated successfully!");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error updating student profile:", error);
      alert("An error occurred while updating the profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await updateStudentAvatar(username, file);

      if (result.success) {
        alert("Avatar updated successfully!");
        setProfileData({ ...profileData, profile_pic: result.data.profile_pic });
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("An error occurred while updating the avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>No profile data found.</div>;

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
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade</label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={profileData.grade || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="section">Section</label>
          <input
            type="text"
            id="section"
            name="section"
            value={profileData.section || ""}
            onChange={handleChange}
            className="form-control"
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
                borderRadius: "50%",
              }}
            />
          ) : (
            <p>No profile picture available</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Update Profile Picture</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="form-control"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
          {isUploading && <p>Uploading...</p>}
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
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
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
