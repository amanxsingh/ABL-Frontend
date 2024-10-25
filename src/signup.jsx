// import { useState } from "react";
// import Login from "./login"; // Import the Login component
// import RegistrationForm from "./registration"; // Import the RegistrationForm component
// import "./signup.css"; // Import your CSS file for styling

// function App() {
//   const [showLogin, setShowLogin] = useState(true);
//   const [animationClass, setAnimationClass] = useState("pop-in");

//   const handleToggle = (isLogin) => {
//     // First, apply the exit animation
//     setAnimationClass("pop-out");

//     // Wait for the exit animation to finish before toggling the form
//     setTimeout(() => {
//       setShowLogin(isLogin);
//       setAnimationClass("pop-in"); // Apply pop-in animation for the new form
//     }, 300); // Match this time with the animation duration (300ms)
//   };

//   return (
//     <div className="app-page">
//       <div
//         className={`background-container ${
//           showLogin ? "login-bg" : "register-bg"
//         }`}
//       >
//         <div className="form-wrapper">
//           <div className="button-container">
//             <button
//               className={`toggle-button ${showLogin ? "active" : ""}`}
//               onClick={() => handleToggle(true)}
//               aria-pressed={showLogin}
//             >
//               Login
//             </button>
//             <button
//               className={`toggle-button ${!showLogin ? "active" : ""}`}
//               onClick={() => handleToggle(false)}
//               aria-pressed={!showLogin}
//             >
//               Register
//             </button>
//           </div>

//           {/* Use the same container for both login and register with animation */}
//           <div className={`form-container ${animationClass}`}>
//             {showLogin ? <Login /> : <RegistrationForm />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App";
import "./signup.css";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    user: {
      role: "", // Default role as empty to show placeholder
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
  const { setIsAuthenticated } = useContext(AuthContext);

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

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://192.168.1.12:8000/login/", {
        username_or_email: formData.username_or_email,
        password: formData.user.password,
      });
      const { username } = response.data;

      localStorage.setItem("username", username);
      localStorage.setItem("isAuthenticated", "true");

      setIsAuthenticated(true);
      setError(null);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.non_field_errors || "Login failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.1.12:8000/register/",
        formData
      );
      setResponseData(response.data);
      setIsRegistered(true); // Set registration success state
      setError(null);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Registration failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRegistered) {
      // Reset `isRegistered` after 3 seconds to revert button text
      const timer = setTimeout(() => {
        setIsRegistered(false);
      }, 3000);

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [isRegistered]);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

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

  useEffect(() => {
    setIsActive(false);
  }, []);

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
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

      {/* Login Form */}
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

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" id="login" onClick={handleLoginClick}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of site features
            </p>
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
