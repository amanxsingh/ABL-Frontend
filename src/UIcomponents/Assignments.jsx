import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  margin: 20px;
`;

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Box = styled.div`
  width: 45%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const AssignmentSubmission = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentText, setAssignmentText] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (!assignmentText.trim() && !file) {
      alert("Please add text or upload a file before submitting.");
      return;
    }

    const newAssignment = {
      text: assignmentText,
      file: file ? file.name : null,
      date: new Date(),
    };

    setAssignments([...assignments, newAssignment]);
    setAssignmentText("");
    setFile(null);
  };

  return (
    <Container>
      <h1>Project Submission</h1>
      <Layout>
        {/* Left Container */}
        <Box>
          <h3>Submit an Project</h3>
          <Textarea
            placeholder="Write something..."
            value={assignmentText}
            onChange={(e) => setAssignmentText(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </Box>

        {/* Right Container */}
        <Box>
          <h3>Submitted Project</h3>
          {assignments.length === 0 ? (
            <p>No Project submitted yet.</p>
          ) : (
            <ul>
              {assignments.map((assignment, index) => (
                <li key={index}>
                  <p>
                    <strong>Text:</strong>{" "}
                    {assignment.text || "No text provided"}
                  </p>
                  {assignment.file && (
                    <p>
                      <strong>File:</strong> {assignment.file}
                    </p>
                  )}
                  <p>
                    <strong>Date:</strong>{" "}
                    {assignment.date.toLocaleDateString()}{" "}
                    {assignment.date.toLocaleTimeString()}
                  </p>
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </Box>
      </Layout>
    </Container>
  );
};

export default AssignmentSubmission;
