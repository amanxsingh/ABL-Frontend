import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App"; // Assuming AuthContext is available for global state
// import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AuthContext); // Access context to update authentication state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.1.12:8000/login/",
        formData
      );
      const { username } = response.data;

      // Store username and authentication status in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("isAuthenticated", "true");

      setIsAuthenticated(true); // Update global auth state
      setError(null);
      setLoading(false);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.non_field_errors || "Login failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username or Email</label>
          <input
            type="text"
            name="username_or_email"
            value={formData.username_or_email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && (
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
