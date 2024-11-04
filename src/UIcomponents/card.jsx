import PropTypes from "prop-types";
import "../UIcomponents/cards.css";

const Card = ({ title, image }) => {
  return (
    <div className="card">
      <div className="top-section">
        <div className="border"></div>
        <div className="icons">
          <div className="logo">
            <svg xmlns="" fill="none" viewBox="0 0 94 120" className="svg">
              {" "}
              {/* Adjusted viewBox height */}
              {/* Increased height here */}
            </svg>
          </div>
          <div className="social-media">{/* Social Media SVG Icons */}</div>
        </div>
        {image && (
          <img
            src={image}
            alt="Overlay Logo"
            className="skyblue-overlay-logo"
          />
        )}
      </div>
      <div className="bottom-section">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  description: PropTypes.string,
};

export default Card;
