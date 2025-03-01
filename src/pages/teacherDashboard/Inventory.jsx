import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/Inventory.css";
import { fetchInventory, createInventory, updateInventory, deleteInventory } from "../../api/teacherApiService";

const Inventory = () => {
  const [components, setComponents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [isModify, setIsModify] = useState(false);
  const [school, setSchool] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchInventory();
      if (result.success) {
        setComponents(result.data);
      } else {
        console.error("Failed to fetch inventory data:", result.error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (component = null) => {
    setCurrentComponent(component);
    setIsModify(!!component);
    setSchool(component ? component.school : "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentComponent(null);
    setIsModify(false);
    setSchool("");
  };

  const handleSaveComponent = async (event) => {
    event.preventDefault();
    const form = event.target;
    const newComponent = {
      id: currentComponent ? currentComponent.id : undefined,
      school: form.elements.school.value,
      component_name: form.elements.name.value,
      total_quantity: parseInt(form.elements.totalQuantity.value, 10),
      quantity_available: parseInt(form.elements.availableQuantity.value, 10),
      components_added_date: form.elements.addedDate.value,
    };

    let result;
    if (currentComponent) {
      result = await updateInventory(newComponent);
    } else {
      result = await createInventory(newComponent);
    }

    if (result.success) {
      const updatedComponent = result.data;
      setComponents((prevComponents) =>
        currentComponent
          ? prevComponents.map((component) => (component.id === updatedComponent.id ? updatedComponent : component))
          : [...prevComponents, updatedComponent]
      );
      handleCloseModal();
    } else {
      console.error("Failed to save component:", result.error);
    }
  };

  const handleDeleteComponent = async (id) => {
    const result = await deleteInventory(id);
    if (result.success) {
      setComponents(components.filter((component) => component.id !== id));
    } else {
      console.error("Failed to delete component:", result.error);
    }
  };

  return (
    <div className="inventory">
      <div className="header">
        <h2>Inventory</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Component
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th>Component Name</th>
            <th>Total Quantity</th>
            <th>Available Quantity</th>
            <th>Added Date</th>
            <th>Modify</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.id}>
              <td>{component.school}</td>
              <td>{component.component_name}</td>
              <td>{component.total_quantity}</td>
              <td>{component.quantity_available}</td>
              <td>{component.components_added_date}</td>
              <td>
                <Button variant="secondary" onClick={() => handleShowModal(component)}>
                  Modify
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteComponent(component.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isModify ? "Modify Component" : "Add Component"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveComponent}>
          <Modal.Body>
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
            <Form.Group controlId="formComponentName">
              <Form.Label>Component Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={currentComponent?.component_name || ""} required />
            </Form.Group>
            <Form.Group controlId="formTotalQuantity">
              <Form.Label>Total Quantity</Form.Label>
              <Form.Control type="number" name="totalQuantity" defaultValue={currentComponent?.total_quantity || ""} required />
            </Form.Group>
            <Form.Group controlId="formAvailableQuantity">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control type="number" name="availableQuantity" defaultValue={currentComponent?.quantity_available || ""} required />
            </Form.Group>
            <Form.Group controlId="formAddedDate">
              <Form.Label>Added Date</Form.Label>
              <Form.Control type="date" name="addedDate" defaultValue={currentComponent?.components_added_date || ""} required />
            </Form.Group>
            {isModify && (
              <>
                <Form.Group controlId="formTransactionType">
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Control as="select" name="transactionType" required>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formQuantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number" name="quantity" required />
                </Form.Group>
                <Form.Group controlId="formPurpose">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control as="select" name="purpose" required>
                    <option value="1">Dropdown 1</option>
                    <option value="2">Dropdown 2</option>
                    <option value="3">Dropdown 3</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {isModify ? "Save Changes" : "Add Component"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;