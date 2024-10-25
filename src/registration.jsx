import { useState } from "react";
import axios from "axios";
// import "./RegistrationForm.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    user: {
      role: "",
      username: "",
      email: "",
      password: "",
    },
    name: "", // Used for student and teacher
    grade: "", // Only for student
    section: "", // Only for student
    school: "", // Used for teacher and school and students
  });

  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  // Handle input changes for the form
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value, // For fields like 'name', 'grade', etc.
      user: {
        ...formData.user,
        [name]: value, // For user-related fields like 'role', 'username', 'email'
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.1.12:8000/register/",
        formData
      );
      setResponseData(response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      }
    }
  };

  // Dynamically render fields based on the role
  const renderRoleSpecificFields = () => {
    const { role } = formData.user;

    if (role === "student") {
      return (
        <div>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Grade
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            />
          </label>
          <label>
            Section
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />
          </label>
          <label>
            School Name
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
            />
          </label>
        </div>
      );
    } else if (role === "teacher") {
      return (
        <div>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            School
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
            />
          </label>
        </div>
      );
    } else if (role === "school") {
      return (
        <div>
          <label>
            School Name
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
            />
          </label>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* <h1>Registration Form</h1> */}
      <form onSubmit={handleSubmit}>
        <label>
          {/* Role: */}
          <select
            name="role"
            value={formData.user.role}
            onChange={handleChange}
          >
            {/* <option value="">Select role</option> */}
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="school">School</option>
          </select>
        </label>

        {/* Common fields for all roles */}
        <label>
          Username
          <input
            type="text"
            name="username"
            value={formData.user.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.user.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.user.password}
            onChange={handleChange}
          />
        </label>

        {/* Render additional fields based on the selected role */}
        {renderRoleSpecificFields()}

        <button type="submit">Register</button>
      </form>

      {/* Display success message with role-specific data */}
      {responseData && (
        <div>
          <h2>Registration Successful</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}

      {/* Display error messages */}
      {error && (
        <div>
          <h2>Error</h2>
          <p>{error.error}</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
