import { useState, useEffect } from "react";
import axios from "axios";
import "./learn.css";

const Learning = () => {
  const totalCircles = 8;
  const [currentCircle, setCurrentCircle] = useState(0); // Start on the first circle
  const [circleStatus, setCircleStatus] = useState(
    Array(totalCircles)
      .fill("white")
      .map((color, index) => (index === 0 ? "orange" : color))
  ); // First circle is orange by default
  const [sectionData, setSectionData] = useState(null); // Data for each section
  const [error, setError] = useState(null);

  // Fetch content for the selected circle
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`http://192.168.1.9:8000/curriculum/`);
        setSectionData(response.data); // Update section data based on API response
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err); // Log the error
      }
    };

    fetchContent();
  }, [currentCircle]);

  // Handle circle click to set the active circle and update colors
  const handleCircleClick = (index) => {
    if (index > currentCircle || index === 0) {
      const newStatus = [...circleStatus];
      if (currentCircle !== index) newStatus[currentCircle] = "green"; // Mark previous as green
      newStatus[index] = "orange"; // Set clicked circle to orange
      setCircleStatus(newStatus);
      setCurrentCircle(index); // Update current circle
    }
  };

  return (
    <div className="learning-container">
      <nav className="navbar">
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

        {/* Show "Next Chapter" button only when last circle is clicked */}
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
        {/* Left container with buttons */}
        <div className="left-menu">
          <button className="menu-button">Video</button>
          <button className="menu-button">Simulator</button>
          <button className="menu-button">Theory</button>
          <button className="menu-button">Quiz</button>
          <button className="menu-button">Test</button>
        </div>

        {/* Right container with subcontent */}
        <div className="content-display">
          {error && <p className="error-message">{error}</p>}
          {sectionData ? (
            <div className="section-content">
              <h2>{sectionData.title}</h2>
              <p>{sectionData.description}</p>
              {/* Display more specific subcontent as needed */}
            </div>
          ) : (
            <p>Loading content...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;
