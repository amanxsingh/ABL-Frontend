import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/KreativityShow.css";

const KreativityShow = () => {
  const [shows, setShows] = useState([
    { id: 1, dateAssigned: "2025-01-01", project: "Project A", student: "Student 1", file: "fileA.pdf" },
    { id: 2, dateAssigned: "2025-02-01", project: "Project B", student: "Student 2", file: "fileB.pdf" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentShow, setCurrentShow] = useState(null);

  const handleShowModal = (show = null) => {
    setCurrentShow(show);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentShow(null);
  };

  const handleSaveShow = (event) => {
    event.preventDefault();
    const form = event.target;
    const newShow = {
      id: currentShow ? currentShow.id : shows.length + 1,
      dateAssigned: form.elements.dateAssigned.value,
      project: form.elements.project.value,
      student: form.elements.student.value,
      file: form.elements.file.files[0].name,
    };

    if (currentShow) {
      setShows(shows.map((show) => (show.id === currentShow.id ? newShow : show)));
    } else {
      setShows([...shows, newShow]);
    }

    handleCloseModal();
  };

  return (
    <div className="kreativity-show">
      <div className="header">
        <h2>Kreativity Show</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Show
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date Assigned</th>
            <th>Project</th>
            <th>Student</th>
            <th>View</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show.id}>
              <td>{show.dateAssigned}</td>
              <td>{show.project}</td>
              <td>{show.student}</td>
              <td>
                <a href={`/${show.file}`} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>
                <Button variant="secondary" onClick={() => handleShowModal(show)}>
                  Modify
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentShow ? "Modify Show" : "Add Show"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveShow}>
          <Modal.Body>
            <Form.Group controlId="formDateAssigned">
              <Form.Label>Date Assigned</Form.Label>
              <Form.Control type="date" name="dateAssigned" defaultValue={currentShow?.dateAssigned || ""} required />
            </Form.Group>
            <Form.Group controlId="formProject">
              <Form.Label>Project</Form.Label>
              <Form.Control type="text" name="project" defaultValue={currentShow?.project || ""} required />
            </Form.Group>
            <Form.Group controlId="formStudent">
              <Form.Label>Student</Form.Label>
              <Form.Control type="text" name="student" defaultValue={currentShow?.student || ""} required />
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
              {currentShow ? "Save Changes" : "Add Show"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default KreativityShow;