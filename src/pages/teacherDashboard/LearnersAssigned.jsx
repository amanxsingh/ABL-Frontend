import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/LearnersAssigned.css";

const LearnersAssigned = () => {
  const [students, setStudents] = useState([
    { id: 1, lmsId: "LMS001", rollNo: 1, name: "Student 1", class: 6, section: "A", innovationClub: "Yes" },
    { id: 2, lmsId: "LMS002", rollNo: 2, name: "Student 2", class: 6, section: "A", innovationClub: "No" },
    // Add more dummy data as needed
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("6A");

  const handleShowModal = (student = null) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStudent(null);
  };

  const handleSaveStudent = (event) => {
    event.preventDefault();
    const form = event.target;
    const newStudent = {
      id: currentStudent ? currentStudent.id : students.length + 1,
      lmsId: form.elements.lmsId.value,
      rollNo: parseInt(form.elements.rollNo.value, 10),
      name: form.elements.name.value,
      class: parseInt(form.elements.class.value, 10),
      section: form.elements.section.value,
      innovationClub: form.elements.innovationClub.value,
    };

    if (currentStudent) {
      setStudents(students.map((student) => (student.id === currentStudent.id ? newStudent : student)));
    } else {
      setStudents([...students, newStudent]);
    }

    handleCloseModal();
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.lmsId.includes(searchTerm) || student.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      `${student.class}${student.section}` === selectedClass
  );

  return (
    <div className="learners-assigned">
      <div className="header">
        <div className="search-box">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder="Search by LMS ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          {["6A", "6B", "6C", "6D", "7A", "7B", "7C", "7D", "8A", "8B", "8C", "8D"].map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Student
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>LMS ID</th>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Innovation Club</th>
            <th>Modify</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.lmsId}</td>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>{student.section}</td>
              <td>{student.innovationClub}</td>
              <td>
                <Button variant="secondary" onClick={() => handleShowModal(student)}>
                  Modify
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteStudent(student.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentStudent ? "Modify Student" : "Add Student"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveStudent}>
          <Modal.Body>
            <Form.Group controlId="formLmsId">
              <Form.Label>LMS ID</Form.Label>
              <Form.Control type="text" name="lmsId" defaultValue={currentStudent?.lmsId || ""} required />
            </Form.Group>
            <Form.Group controlId="formRollNo">
              <Form.Label>Roll No.</Form.Label>
              <Form.Control type="number" name="rollNo" defaultValue={currentStudent?.rollNo || ""} required />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={currentStudent?.name || ""} required />
            </Form.Group>
            <Form.Group controlId="formClass">
              <Form.Label>Class</Form.Label>
              <Form.Control as="select" name="class" defaultValue={currentStudent?.class || ""} required>
                {[...Array(12).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSection">
              <Form.Label>Section</Form.Label>
              <Form.Control as="select" name="section" defaultValue={currentStudent?.section || ""} required>
                {["A", "B", "C", "D"].map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formInnovationClub">
              <Form.Label>Innovation Club</Form.Label>
              <Form.Control as="select" name="innovationClub" defaultValue={currentStudent?.innovationClub || ""} required>
                {["Yes", "No"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {currentStudent ? "Save Changes" : "Add Student"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default LearnersAssigned;