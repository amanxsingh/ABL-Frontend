import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/StudentReport.css";
import LearnersAssigned from "./LearnersAssigned";

const StudentReport = () => {
  const [activeTab, setActiveTab] = useState("studentAttendance");
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [homeworkData, setHomeworkData] = useState([
    { id: 1, date: "2025-01-01", topic: "Math Homework", class: 6, section: "A", file: "homework1.pdf" },
    { id: 2, date: "2025-01-02", topic: "Science Homework", class: 7, section: "B", file: "homework2.pdf" },
  ]);

  const [assessmentData, setAssessmentData] = useState([
    { id: 1, date: "2025-01-03", topic: "Math Assessment", class: 6, section: "A", file: "assessment1.pdf" },
    { id: 2, date: "2025-01-04", topic: "Science Assessment", class: 7, section: "B", file: "assessment2.pdf" },
  ]);

  const handleShowModal = (item = null) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
  };

  const handleSaveItem = (event) => {
    event.preventDefault();
    const form = event.target;
    const newItem = {
      id: currentItem ? currentItem.id : activeTab === "homework" ? homeworkData.length + 1 : assessmentData.length + 1,
      date: form.elements.date.value,
      topic: form.elements.topic.value,
      class: parseInt(form.elements.class.value, 10),
      section: form.elements.section.value,
      file: form.elements.file.files[0].name,
    };

    if (activeTab === "homework") {
      if (currentItem) {
        setHomeworkData(homeworkData.map((item) => (item.id === currentItem.id ? newItem : item)));
      } else {
        setHomeworkData([...homeworkData, newItem]);
      }
    } else {
      if (currentItem) {
        setAssessmentData(assessmentData.map((item) => (item.id === currentItem.id ? newItem : item)));
      } else {
        setAssessmentData([...assessmentData, newItem]);
      }
    }

    handleCloseModal();
  };

  const handleDeleteItem = (id) => {
    if (activeTab === "homework") {
      setHomeworkData(homeworkData.filter((item) => item.id !== id));
    } else {
      setAssessmentData(assessmentData.filter((item) => item.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "learnersAssigned":
        return <LearnersAssigned />;
      case "leaderboard":
        return <div>No leaderboard available</div>;
      case "homework":
      case "assessment":
        const data = activeTab === "homework" ? homeworkData : assessmentData;
        return (
          <div>
            <div className="report-cards">
              <div className="report-card">
                <div className="number">{Math.floor(Math.random() * 100)}</div>
                Total Students
              </div>
              <div className="report-card">
                <div className="number">{Math.floor(Math.random() * 100)}</div>
                Students Attempted
              </div>
              <div className="report-card">
                <div className="number">{Math.floor(Math.random() * 100)}%</div>
                Completion Rate
              </div>
              <div className="report-card">
                <div className="number">{Math.floor(Math.random() * 100)}</div>
                Average Score
              </div>
            </div>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Add {activeTab === "homework" ? "Homework" : "Assessment"}
            </Button>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>View</th>
                  <th>Modify</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.topic}</td>
                    <td>{item.class}</td>
                    <td>{item.section}</td>
                    <td>
                      <a href={`/${item.file}`} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    <td>
                      <Button variant="secondary" onClick={() => handleShowModal(item)}>
                        Modify
                      </Button>
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "studentAttendance":
        return <div>No data available</div>;
      default:
        return null;
    }
  };

  return (
    <div className="student-report">
      <div className="top-bar">
        <Button
          variant={activeTab === "studentAttendance" ? "primary" : "secondary"}
          onClick={() => setActiveTab("studentAttendance")}
        >
          Students Attendance
        </Button>
        <Button
          variant={activeTab === "homework" ? "primary" : "secondary"}
          onClick={() => setActiveTab("homework")}
        >
          Homework
        </Button>
        <Button
          variant={activeTab === "assessment" ? "primary" : "secondary"}
          onClick={() => setActiveTab("assessment")}
        >
          Assessment
        </Button>
        <Button
          variant={activeTab === "leaderboard" ? "primary" : "secondary"}
          onClick={() => setActiveTab("leaderboard")}
        >
          Leaderboard
        </Button>
        <Button
          variant={activeTab === "learnersAssigned" ? "primary" : "secondary"}
          onClick={() => setActiveTab("learnersAssigned")}
        >
          Learner's Assigned
        </Button>
      </div>
      <div className="content-area">{renderContent()}</div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add {activeTab === "homework" ? "Homework" : "Assessment"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveItem}>
          <Modal.Body>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" required />
            </Form.Group>
            <Form.Group controlId="formTopic">
              <Form.Label>Topic</Form.Label>
              <Form.Control type="text" name="topic" required />
            </Form.Group>
            <Form.Group controlId="formClass">
              <Form.Label>Class</Form.Label>
              <Form.Control as="select" name="class" required>
                {[...Array(12).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSection">
              <Form.Label>Section</Form.Label>
              <Form.Control as="select" name="section" required>
                {["A", "B", "C", "D"].map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formFile">
              <Form.Label>Upload File</Form.Label>
              <Form.Control type="file" name="file" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add {activeTab === "homework" ? "Homework" : "Assessment"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentReport;