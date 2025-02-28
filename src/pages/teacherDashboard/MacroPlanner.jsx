import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/MacroPlanner.css";

const MacroPlanner = () => {
  const [planners, setPlanners] = useState([
    { id: 1, grade: 1, file: "file1.pdf" },
    { id: 2, grade: 2, file: "file2.pdf" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlanner, setCurrentPlanner] = useState(null);

  const handleShowModal = (planner = null) => {
    setCurrentPlanner(planner);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPlanner(null);
  };

  const handleSavePlanner = (event) => {
    event.preventDefault();
    const form = event.target;
    const newPlanner = {
      id: currentPlanner ? currentPlanner.id : planners.length + 1,
      grade: parseInt(form.elements.grade.value, 10),
      file: form.elements.file.files[0].name,
    };

    if (currentPlanner) {
      setPlanners(planners.map((planner) => (planner.id === currentPlanner.id ? newPlanner : planner)));
    } else {
      setPlanners([...planners, newPlanner]);
    }

    handleCloseModal();
  };

  const handleDeletePlanner = (id) => {
    setPlanners(planners.filter((planner) => planner.id !== id));
  };

  return (
    <div className="macro-planner">
      <div className="header">
        <h2>Macro Planner</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add MacroPlanner
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Grade</th>
            <th>View</th>
            <th>Modify</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {planners.map((planner) => (
            <tr key={planner.id}>
              <td>{planner.grade}</td>
              <td>
                <a href={`/${planner.file}`} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>
                <Button variant="secondary" onClick={() => handleShowModal(planner)}>
                  Modify
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeletePlanner(planner.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentPlanner ? "Modify MacroPlanner" : "Add MacroPlanner"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSavePlanner}>
          <Modal.Body>
            <Form.Group controlId="formGrade">
              <Form.Label>Grade</Form.Label>
              <Form.Control as="select" name="grade" defaultValue={currentPlanner?.grade || ""} required>
                {[...Array(12).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
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
              {currentPlanner ? "Save Changes" : "Add MacroPlanner"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MacroPlanner;