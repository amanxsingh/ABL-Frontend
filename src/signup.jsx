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
import { useState } from "react";
import "./signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGoogle,
  faGithub,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const App = () => {
  const [active, setActive] = useState(false);

  const handleRegisterClick = () => {
    setActive(true);
  };

  const handleLoginClick = () => {
    setActive(false);
  };

  return (
    <div className={`container ${active ? "active" : ""}`} id="container">
      <div className="form-container sign-up">
        <form>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="social">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faGoogle} />
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form>
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="social">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faGoogle} />
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
          <span>or use your email password</span>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Forgot your password?</a>
          <button>Sign In</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the sites features</p>
            <button className="hidden" id="login" onClick={handleLoginClick}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of the sites
              features
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

export default App;
