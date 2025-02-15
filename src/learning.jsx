import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faVideo,
  faLaptopCode,
  faQuestionCircle,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { curriculum } from "./api/apiservice";
import "./utils/css/learn.css";
import Loader from "./UIcomponents/dashboard/loader";
import DocumentViewer from "./hint";
import Popup from "./popup";

const Learning = () => {
  const totalCircles = 8;
  const [currentCircle, setCurrentCircle] = useState(0);
  const [completedCircles, setCompletedCircles] = useState([]);
  const [circleStatus, setCircleStatus] = useState(
    Array(totalCircles).fill("white")
  );
  const [countdown, setCountdown] = useState(2);
  const [sectionData, setSectionData] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState("content");
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message

  const { subject, standard } = useParams();
  const navigate = useNavigate();

  // Fetch content on load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await curriculum(subject, standard);
        if (response.success) {
          setAllLessons(response.data);
          setError(null);

          // Load the first circle's data
          const firstLesson = response.data.find((item) => item.position === 1);
          if (firstLesson) {
            setSectionData(firstLesson);
          }
        } else {
          setError(response.error || "Unable to fetch data.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error("Fetch Content Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [subject, standard, navigate]);

  // Countdown Timer for Mark as Completed Button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleMarkAsCompleted = () => {
    if (currentCircle === totalCircles - 1) {
      setPopupMessage("Bravo! You have completed the subject.");
      setShowPopup(true); // Show popup
      return; // Exit the function
    }

    setCompletedCircles((prev) => [...prev, currentCircle]); // Mark current circle as completed
    setCircleStatus((prev) =>
      prev.map((status, index) => (index === currentCircle ? "green" : status))
    ); // Update circle color
    setCurrentCircle((prev) => prev + 1); // Move to the next circle
    setCountdown(2); // Reset countdown

    // Update section data
    const nextLesson = allLessons.find(
      (item) => item.position === currentCircle + 2
    );
    if (nextLesson) {
      setSectionData(nextLesson);
    }
  };

  const getCircleColor = (index) => {
    if (completedCircles.includes(index)) return "green"; // Permanently completed circles
    if (index === currentCircle) return "orange"; // Current circle
    return "white"; // Not completed circles
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const getEmbedUrl = (url) => {
    if (url && url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  const handleCircleClick = (index) => {
    if (index > currentCircle) return; // Can't jump ahead to future circles

    setCurrentCircle(index);

    // Update section data
    const lesson = allLessons.find((item) => item.position === index + 1);
    if (lesson) {
      setSectionData(lesson);
    }
  };

  return (
    <div className="learning-container">
      <nav className="navbar1">
        <div className="navbar-text">Your Progress</div>
        <div className="circle-container">
          {Array.from({ length: totalCircles }).map((_, index) => (
            <div
              key={index}
              className="circle"
              style={{ backgroundColor: getCircleColor(index) }}
              onClick={() => handleCircleClick(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <button
          className="mark-completed-button"
          onClick={handleMarkAsCompleted}
          disabled={countdown > 0}
          style={{
            marginLeft: "auto",
            marginRight: "20px",
            padding: "10px 15px",
            backgroundColor: countdown > 0 ? "#ccc" : "#28a745",
            color: countdown > 0 ? "#555" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: countdown > 0 ? "not-allowed" : "pointer",
          }}
        >
          {countdown > 0 ? `Wait ${countdown} sec` : "Mark as Completed"}
        </button>
      </nav>

      <div className="content-layout">
        <div className="left-menu">
          {[
            { label: "Content", icon: faBook, value: "content" },
            { label: "Video", icon: faVideo, value: "video" },
            { label: "Simulator", icon: faLaptopCode, value: "simulator" },
            { label: "Quiz", icon: faQuestionCircle, value: "quiz" },
            { label: "Hint", icon: faQuestion, value: "hint" },
          ].map(({ label, icon, value }) => (
            <button
              key={value}
              className={`menu-button ${
                selectedButton === value ? "active" : ""
              }`}
              onClick={() => handleButtonClick(value)}
              aria-label={`Navigate to ${label}`}
            >
              <FontAwesomeIcon icon={icon} className="menu-icon" />
              <span className="menu-text">{label}</span>
            </button>
          ))}
        </div>

        <div className="content-display">
          {loading ? (
            <Loader />
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : sectionData ? (
            <div className="section-content">
              {selectedButton === "content" &&
                (sectionData.content ? (
                  <iframe
                    src={getEmbedUrl(sectionData.content)}
                    title="Content Frame"
                    width="100%"
                    height="570px"
                  />
                ) : (
                  <p>Content not available</p>
                ))}
              {selectedButton === "video" &&
                (sectionData.tutorial_video ? (
                  <iframe
                    src={getEmbedUrl(sectionData.tutorial_video)}
                    title="Video Frame"
                    width="100%"
                    height="570px"
                    allowFullScreen
                  />
                ) : (
                  <p>Video not available</p>
                ))}
              {selectedButton === "simulator" &&
                (sectionData.editor ? (
                  <iframe
                    src={getEmbedUrl(sectionData.editor)}
                    title="Simulator Frame"
                    width="100%"
                    height="570px"
                  />
                ) : (
                  <Loader />
                ))}
              {selectedButton === "quiz" &&
                (sectionData.quiz ? (
                  <iframe
                    src={getEmbedUrl(sectionData.quiz)}
                    title="Quiz Frame"
                    width="100%"
                    height="570px"
                  />
                ) : (
                  <p>Quiz not available</p>
                ))}
              {selectedButton === "hint" &&
                (sectionData.hint ? (
                  <>
                    <DocumentViewer url={sectionData.hint} />
                  </>
                ) : (
                  <p>Hint not available</p>
                ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Render Popup */}
      {showPopup && (
        <Popup
          isOpen={showPopup}
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Learning;
