import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/MacroPlanner.css";
import { fetchMacroPlanner, addMacroPlanner, updateMacroPlanner, deleteMacroPlanner } from "../../api/teacherApiService";

const MacroPlanner = () => {
  const [planners, setPlanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlanner, setCurrentPlanner] = useState(null);
  const [school, setSchool] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchMacroPlanner();
      if (result.success) {
        setPlanners(result.data.macroplanner);
      } else {
        console.error("Failed to fetch macroplanner data:", result.error);
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
      grade: form.elements.grade.value,
      school: form.elements.school.value,
      file: form.elements.file.files[0],
    };

    let result;
    if (currentPlanner) {
      result = await updateMacroPlanner(newPlanner);
    } else {
      result = await addMacroPlanner(newPlanner);
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
      console.error("Failed to save macroplanner:", result.error);
    }
  };

  const handleDeletePlanner = async (id) => {
    const result = await deleteMacroPlanner(id);
    if (result.success) {
      setPlanners(planners.filter((planner) => planner.id !== id));
    } else {
      console.error("Failed to delete macroplanner:", result.error);
    }
  };

  const handleViewPlanner = (planner) => {
    window.open(`https://mechanzo.com${planner.file}`, '_blank');
  };

  return (
    <div className="macro-planner">
      <div className="header">
        <h2>Macro Planner</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add MacroPlanner
        </Button>
      </div>
      {planners.length === 0 ? (
        <p>No MacroPlanner is available for this teacher.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>School</th>
              <th>View</th>
              <th>Modify</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {planners.map((planner) => (
              <tr key={planner.id}>
                <td>{planner.grade}</td>
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
      )}

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
              {currentPlanner ? "Save Changes" : "Add MacroPlanner"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MacroPlanner;