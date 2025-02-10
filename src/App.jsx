import { createContext, useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
// import Login from "./login";
import Signup from "./signup";
import Dashboard from "./dashboard";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Learning from "./learning";
import SchoolDashboard from "./SchoolDashboard";


// Create a context to hold the authentication state
export const AuthContext = createContext();

function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// PropTypes validation for children
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  // Restore auth state from localStorage
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    const storedRole = localStorage.getItem("role");

    if (storedAuthStatus === "true") {
      setIsAuthenticated(true);
      setRole(storedRole || ""); // Set role to empty string if not found
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
        {/* Redirect users to the correct dashboard based on their role */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {role === "school" ? <Navigate to="/school_dashboard" /> : <Dashboard />}
            </PrivateRoute>
          }
        />

        <Route
          path="/school_dashboard"
          element={
            <PrivateRoute>
              {role === "student" ? <Navigate to="/dashboard" /> : <SchoolDashboard />}
            </PrivateRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/learning/:standard/:subject/"
          element={
            <PrivateRoute>
              <Learning />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;

