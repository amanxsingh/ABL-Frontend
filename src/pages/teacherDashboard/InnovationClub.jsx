import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/InnovationClub.css";

const InnovationClub = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project A", date: "2025-01-01", student: "Student 1", progress: "50%", file: "fileA.pdf" },
    { id: 2, name: "Project B", date: "2025-02-01", student: "Student 2", progress: "75%", file: "fileB.pdf" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const handleShowModal = (project = null) => {
    setCurrentProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProject(null);
  };

  const handleSaveProject = (event) => {
    event.preventDefault();
    const form = event.target;
    const newProject = {
      id: currentProject ? currentProject.id : projects.length + 1,
      name: form.elements.name.value,
      date: form.elements.date.value,
      student: form.elements.student.value,
      progress: form.elements.progress.value,
      file: form.elements.file.files[0].name,
    };

    if (currentProject) {
      setProjects(projects.map((project) => (project.id === currentProject.id ? newProject : project)));
    } else {
      setProjects([...projects, newProject]);
    }

    handleCloseModal();
  };

  return (
    <div className="innovation-club">
      <div className="header">
        <h2>Innovation Club</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Project
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Date</th>
            <th>Student</th>
            <th>Progress</th>
            <th>View</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.date}</td>
              <td>{project.student}</td>
              <td>{project.progress}</td>
              <td>
                <a href={`/${project.file}`} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>
                <Button variant="secondary" onClick={() => handleShowModal(project)}>
                  Modify
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProject ? "Modify Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProject}>
          <Modal.Body>
            <Form.Group controlId="formProjectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={currentProject?.name || ""} required />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" defaultValue={currentProject?.date || ""} required />
            </Form.Group>
            <Form.Group controlId="formStudent">
              <Form.Label>Student</Form.Label>
              <Form.Control type="text" name="student" defaultValue={currentProject?.student || ""} required />
            </Form.Group>
            <Form.Group controlId="formProgress">
              <Form.Label>Progress</Form.Label>
              <Form.Control type="text" name="progress" defaultValue={currentProject?.progress || ""} required />
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
              {currentProject ? "Save Changes" : "Add Project"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default InnovationClub;