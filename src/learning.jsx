import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom"; // Updated import
import { curriculum } from "./apiservice";
import "./learn.css";

const Learning = () => {
  const totalCircles = 8;
  const [currentCircle, setCurrentCircle] = useState(0);
  const [circleStatus, setCircleStatus] = useState(
    Array(totalCircles)
      .fill("white")
      .map((color, index) => (index === 0 ? "orange" : color))
  );
  const [sectionData, setSectionData] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState("content");

  const { subject, standard } = useParams();
  const navigate = useNavigate(); // Updated hook

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Redirect to login if no token is found
      navigate("/login");
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      const response = await curriculum(subject, standard);
      if (response.success) {
        setAllLessons(response.data);
        setError(null);

        // Set the first lesson (position 1) as default
        const firstLesson = response.data.find((item) => item.position === 1);
        if (firstLesson) {
          setCurrentCircle(0);
          setSectionData(firstLesson);
        }
      } else {
        setError(response.error);
      }
      setLoading(false);
    };

    fetchContent();
  }, [subject, standard, navigate]);

  const handleCircleClick = (index) => {
    if (index > currentCircle || index === 0) {
      const newStatus = [...circleStatus];
      if (currentCircle !== index) newStatus[currentCircle] = "green";
      newStatus[index] = "orange";
      setCircleStatus(newStatus);
      setCurrentCircle(index);

      const lesson = allLessons.find((item) => item.position === index + 1);
      if (lesson) {
        setSectionData(lesson);
      }
    }
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

  return (
    <div className="learning-container">
      <nav className="navbar1">
        <div className="navbar-text">Your Progress</div>
        <div className="circle-container">
          {circleStatus.map((color, index) => (
            <div
              key={index}
              className="circle"
              style={{ backgroundColor: color }}
              onClick={() => handleCircleClick(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        {currentCircle === totalCircles - 1 && (
          <button
            className="next-chapter-button"
            onClick={() => alert("Proceeding to Next Chapter")}
          >
            Next Chapter
          </button>
        )}
      </nav>

      <div className="content-layout">
        <div className="left-menu">
          <button
            className={`menu-button ${
              selectedButton === "content" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("content")}
          >
            Content
          </button>
          <button
            className={`menu-button ${
              selectedButton === "video" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("video")}
          >
            Video
          </button>
          <button
            className={`menu-button ${
              selectedButton === "simulator" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("simulator")}
          >
            Simulator
          </button>
          <button
            className={`menu-button ${
              selectedButton === "quiz" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("quiz")}
          >
            Quiz
          </button>
          <button
            className={`menu-button ${
              selectedButton === "test" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("test")}
          >
            Test
          </button>
        </div>

        <div className="content-display">
          {loading ? (
            <p>Loading content...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            sectionData && (
              <div className="section-content">
                {selectedButton === "content" &&
                  (sectionData.content ? (
                    <iframe
                      src={getEmbedUrl(sectionData.content)}
                      title="Content Frame"
                      width="100%"
                      height="500px"
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
                      height="500px"
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
                      height="500px"
                    />
                  ) : (
                    <p>Simulator not available</p>
                  ))}
                {selectedButton === "quiz" &&
                  (sectionData.quiz ? (
                    <iframe
                      src={getEmbedUrl(sectionData.quiz)}
                      title="Quiz Frame"
                      width="100%"
                      height="500px"
                    />
                  ) : (
                    <p>Quiz not available</p>
                  ))}
                {selectedButton === "test" &&
                  (sectionData.test ? (
                    <iframe
                      src={getEmbedUrl(sectionData.test)}
                      title="Test Frame"
                      width="100%"
                      height="500px"
                    />
                  ) : (
                    <p>Test not available</p>
                  ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes for validation
Learning.propTypes = {
  subject: PropTypes.string,
  standard: PropTypes.string,
};

export default Learning;
