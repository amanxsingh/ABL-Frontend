import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/StudentReport.css";
import LearnersAssigned from "./LearnersAssigned";
import { fetchStudentAccessReport, fetchHomeworkReport } from "../../api/teacherApiService";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const StudentReport = () => {
  const [activeTab, setActiveTab] = useState("studentAttendance");
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [studentAccessData, setStudentAccessData] = useState(null);
  const [selectedGradeSection, setSelectedGradeSection] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [homeworkReportData, setHomeworkReportData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchStudentAccessReport();
      if (result.success) {
        setStudentAccessData(result.data);
      } else {
        console.error("Failed to fetch student access report:", result.error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchHomeworkData = async () => {
      const result = await fetchHomeworkReport();
      if (result.success) {
        setHomeworkReportData(result.data);
      } else {
        console.error("Failed to fetch homework report data:", result.error);
      }
    };

    fetchHomeworkData();
  }, []);

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

  const handleGradeSectionChange = (event) => {
    setSelectedGradeSection(event.target.value);
    setSelectedStudent(null);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  const renderStudentTable = () => {
    if (!selectedGradeSection) return null;

    const [grade, section] = selectedGradeSection.split("-");
    const students = studentAccessData.students_by_grade_and_section[grade].sections[section];

    const filteredStudents = students.filter(
      (student) =>
        student.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <Form.Group controlId="formSearch">
          <Form.Label></Form.Label>
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>View Attendance Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.user.username}>
                <td>{student.login_activity.id}</td>
                <td>{student.name}</td>
                <td>
                  <Button variant="primary" onClick={() => handleViewDetails(student)}>
                    View Attendance Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStudentDetails = () => {
    if (!selectedStudent) return null;

    const { name, grade, section, school, profile_pic, login_activity } = selectedStudent;

    const chartData = {
      labels: [login_activity.login_datetime],
      datasets: [
        {
          label: 'Login Count',
          data: [login_activity.login_num],
          fill: false,
          backgroundColor: 'blue',
          borderColor: 'blue',
        },
      ],
    };

    return (
      <div>
        <Button variant="primary" onClick={handleBack}>
          Back
        </Button>
        <h4>Attendance Details for {name}</h4>
        <table className="table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td>Grade</td>
              <td>{grade}</td>
            </tr>
            <tr>
              <td>Section</td>
              <td>{section}</td>
            </tr>
            <tr>
              <td>School</td>
              <td>{school}</td>
            </tr>
            <tr>
              <td>Profile Picture</td>
              <td><img src={profile_pic} alt={name} width="100" /></td>
            </tr>
            <tr>
              <td>Login DateTime</td>
              <td>{login_activity.login_datetime}</td>
            </tr>
            <tr>
              <td>Login IP</td>
              <td>{login_activity.login_IP}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{login_activity.status}</td>
            </tr>
          </tbody>
        </table>
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "learnersAssigned":
        return <LearnersAssigned />;
      case "leaderboard":
        return <div>No leaderboard available</div>;
      case "homework":
      case "assessment":
        const data = activeTab === "homework" ? homeworkReportData : assessmentData;
        return (
          <div>
            <div className="report-cards">
              <div className="report-card">
                <div className="number">{data.length > 0 ? data[0].total_students : 0}</div>
                Total Students
              </div>
              <div className="report-card">
                <div className="number">{data.length > 0 ? data[0].students_attempted : 0}</div>
                Students Attempted
              </div>
              <div className="report-card">
                <div className="number">{data.length > 0 ? `${data[0].completion_rate}%` : "0%"}</div>
                Completion Rate
              </div>
              <div className="report-card">
                <div className="number">{data.length > 0 ? data[0].average_score : 0}</div>
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
        return (
          <div>
            {studentAccessData ? (
              <div>
                <Form.Group controlId="formGradeSection">
                  <Form.Label></Form.Label>
                  <Form.Control as="select" value={selectedGradeSection} onChange={handleGradeSectionChange}>
                    <option value="">Select Grade</option>
                    {Object.entries(studentAccessData.students_by_grade_and_section).map(([grade, gradeData]) =>
                      Object.keys(gradeData.sections).map((section) => (
                        <option key={`${grade}-${section}`} value={`${grade}-${section}`}>
                          Grade {grade} {section}
                        </option>
                      ))
                    )}
                  </Form.Control>
                </Form.Group>
                {selectedStudent ? renderStudentDetails() : renderStudentTable()}
              </div>
            ) : (
              <div>No data available</div>
            )}
          </div>
        );
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