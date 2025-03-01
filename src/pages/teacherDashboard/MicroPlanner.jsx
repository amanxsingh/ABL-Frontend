import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/MicroPlanner.css";
import { fetchMicroPlanner, addMicroPlanner, updateMicroPlanner, deleteMicroPlanner } from "../../api/teacherApiService";

const MicroPlanner = () => {
  const [planners, setPlanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlanner, setCurrentPlanner] = useState(null);
  const [school, setSchool] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchMicroPlanner();
      if (result.success) {
        setPlanners(result.data.microplanner);
      } else {
        console.error("Failed to fetch microplanner data:", result.error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (planner = null) => {
    setCurrentPlanner(planner);
    setSchool(planner ? planner.school : "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPlanner(null);
    setSchool("");
  };

  const handleSavePlanner = async (event) => {
    event.preventDefault();
    const form = event.target;
    const newPlanner = {
      id: currentPlanner ? currentPlanner.id : undefined,
      month: form.elements.month.value,
      school: form.elements.school.value,
      microplanner: form.elements.file.files[0],
    };

    let result;
    if (currentPlanner) {
      result = await updateMicroPlanner(newPlanner);
    } else {
      result = await addMicroPlanner(newPlanner);
    }

    if (result.success) {
      const updatedPlanner = result.data;
      setPlanners((prevPlanners) =>
        currentPlanner
          ? prevPlanners.map((planner) => (planner.id === updatedPlanner.id ? updatedPlanner : planner))
          : [...prevPlanners, updatedPlanner]
      );
      handleCloseModal();
    } else {
      console.error("Failed to save microplanner:", result.error);
    }
  };

  const handleDeletePlanner = async (id) => {
    const result = await deleteMicroPlanner(id);
    if (result.success) {
      setPlanners(planners.filter((planner) => planner.id !== id));
    } else {
      console.error("Failed to delete microplanner:", result.error);
    }
  };

  const handleViewPlanner = (planner) => {
    window.open(`https://mechanzo.com${planner.microplanner}`, '_blank');
  };

  return (
    <div className="micro-planner">
      <div className="header">
        <h2>Micro Planner</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add MicroPlanner
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Month</th>
            <th>School</th>
            <th>View</th>
            <th>Modify</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {planners.map((planner) => (
            <tr key={planner.id}>
              <td>{planner.month}</td>
              <td>{planner.school}</td>
              <td>
                <Button variant="link" onClick={() => handleViewPlanner(planner)}>
                  View
                </Button>
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
          <Modal.Title>{currentPlanner ? "Modify MicroPlanner" : "Add MicroPlanner"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSavePlanner}>
          <Modal.Body>
            <Form.Group controlId="formMonth">
              <Form.Label>Month</Form.Label>
              <Form.Control as="select" name="month" defaultValue={currentPlanner?.month || ""} required>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSchool">
              <Form.Label>School</Form.Label>
              <Form.Control
                type="text"
                name="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
              />
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
              {currentPlanner ? "Save Changes" : "Add MicroPlanner"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MicroPlanner;