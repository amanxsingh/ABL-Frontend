import { createContext, useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Signup from "./Components/auth/signup";
import Dashboard from "./pages/studentDashboard/dashboard";
import Learning from "./learning";
import SchoolDashboard from "./pages/schoolDashboard/SchoolDashboard";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

// Create a context to manage authentication state
export const AuthContext = createContext();

function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Role-based redirection
function RoleBasedRoute() {
  const { role } = useContext(AuthContext);
  if (role === "school") return <Navigate to="/school_dashboard" />;
  return <Dashboard />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  // Load authentication state from localStorage
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    const storedRole = localStorage.getItem("role");

    if (storedAuthStatus === "true") {
      setIsAuthenticated(true);
      setRole(storedRole || "");
    }
  }, []);

  // Sync authentication state with localStorage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("role", role);
  }, [isAuthenticated, role]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role, setRole }}>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signup />} />

        {/* Role-based dashboard navigation */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RoleBasedRoute />
            </PrivateRoute>
          }
        />

        {/* School Dashboard Route */}
        <Route
          path="/school_dashboard"
          element={
            <PrivateRoute>
              {role === "student" ? <Navigate to="/dashboard" /> : <SchoolDashboard />}
            </PrivateRoute>
          }
        />

        {/* Learning Route */}
        <Route
          path="/learning/:standard/:subject"
          element={
            <PrivateRoute>
              <Learning />
            </PrivateRoute>
          }
        />

        {/* Catch-all route to redirect unknown URLs */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
