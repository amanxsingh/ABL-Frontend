// LoginPage.js
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App";
import "./signup.css";
import { login, register } from "./apiservice";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    user: {
      role: "",
      username: "",
      email: "",
      password: "",
    },
    username_or_email: "",
    name: "",
    grade: "",
    section: "",
    school: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setRole } = useContext(AuthContext); // Get setRole from context

  // Handle input changes for login and sign-up forms
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["role", "username", "email", "password"].includes(name)) {
      setFormData((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle login form submission
 

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username_or_email, user } = formData;
    const result = await login(username_or_email, user.password);
    setLoading(false);
    
    if (result.success) {
      setIsAuthenticated(true);
      setRole(result.data.role); // ✅ Update role here
      setError(null);
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };
  

  // Handle sign-up form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Ensure the user object is properly formatted
    const formattedUserData = {
      ...formData,
      user: { ...formData.user }, // This ensures the user object is properly structured
    };
  
    const result = await register(formattedUserData);
    setLoading(false);
  
    if (result.success) {
      setError(null);
      navigate("/login"); // Redirect to login after successful signup
    } else {
      setError(result.error);
    }
  };
  


  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  // Reset registration state after 5 seconds
  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        setIsRegistered(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick = () => setIsActive(false);

  const roleFields = {
    student: [
      { name: "name", placeholder: "Name" },
      { name: "grade", placeholder: "Grade" },
      { name: "section", placeholder: "Section" },
      { name: "school", placeholder: "School Name" },
    ],
    teacher: [
      { name: "name", placeholder: "Name" },
      { name: "school", placeholder: "School" },
    ],
    school: [{ name: "school", placeholder: "School Name" }],
  };

  // Render form fields specific to the selected role
  const renderRoleSpecificFields = () => {
    return roleFields[formData.user.role]?.map(({ name, placeholder }) => (
      <label key={name}>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
        />
      </label>
    ));
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      {/* Sign-up form */}
      <div className="form-container sign-up">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <div className="scrollable-container">
            <label>
              <select
                name="role"
                value={formData.user.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Role
                </option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="school">School</option>
              </select>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.user.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.user.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.user.password}
              onChange={handleChange}
              required
            />
            {renderRoleSpecificFields()}
          </div>
          <button type="submit" disabled={loading || isRegistered}>
            {loading
              ? "Registering..."
              : isRegistered
              ? "Registration Successful"
              : "Sign Up"}
          </button>
          {error && (
            <p className="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Login form */}
      <div className="form-container sign-in">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
          <span>or use your email and password</span>
          <input
            type="text"
            name="username_or_email"
            placeholder="Username or Email"
            value={formData.username_or_email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.user.password}
            onChange={handleChange}
            required
          />
          <a href="#">Forgot your password?</a>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>
          {error && (
            <p className="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Toggle container */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all site features</p>
            <button className="hidden" id="login" onClick={handleLoginClick}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all site features</p>
            <button
              className="hidden"
              id="register"
              onClick={handleRegisterClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
