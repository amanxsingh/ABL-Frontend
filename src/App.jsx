import { createContext, useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
// import Login from "./login";
import Signup from "./signup";
import Dashboard from "./dashboard";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

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

  // Check if user is already logged in (restore auth state from localStorage)
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    if (storedAuthStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
