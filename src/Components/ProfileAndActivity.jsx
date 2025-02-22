import { useState } from "react";
import ProfileSetting from "./ProfileSetting";
import StudentLoginActivity from "./StudentLoginActivity";

const ProfileAndActivity = () => {
  const [activeView, setActiveView] = useState("profile");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveView("profile")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeView === "profile" ? "#0056b3" : "#007bff",
            color: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => {
            if (activeView !== "profile") e.target.style.backgroundColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            if (activeView !== "profile") e.target.style.backgroundColor = "#007bff";
          }}
        >
          Profile Setting
        </button>
        <button
          onClick={() => setActiveView("loginActivity")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeView === "loginActivity" ? "#0056b3" : "#007bff",
            color: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => {
            if (activeView !== "loginActivity") e.target.style.backgroundColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            if (activeView !== "loginActivity") e.target.style.backgroundColor = "#007bff";
          }}
        >
          Login Activity
        </button>
      </div>

      {activeView === "profile" && <ProfileSetting />}
      {activeView === "loginActivity" && <StudentLoginActivity />}
    </div>
  );
};

export default ProfileAndActivity;