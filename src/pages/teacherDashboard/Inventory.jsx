import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/Inventory.css";

const Inventory = () => {
  const [components, setComponents] = useState([
    { id: 1, name: "Component A", totalQuantity: 100, availableQuantity: 80, addedDate: "2025-01-01" },
    { id: 2, name: "Component B", totalQuantity: 200, availableQuantity: 150, addedDate: "2025-02-01" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [isModify, setIsModify] = useState(false);

  const handleShowModal = (component = null) => {
    setCurrentComponent(component);
    setIsModify(!!component);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentComponent(null);
    setIsModify(false);
  };

  const handleSaveComponent = (event) => {
    event.preventDefault();
    const form = event.target;
    const newComponent = {
      id: currentComponent ? currentComponent.id : components.length + 1,
      name: form.elements.name.value,
      totalQuantity: parseInt(form.elements.totalQuantity.value, 10),
      availableQuantity: parseInt(form.elements.availableQuantity.value, 10),
      addedDate: form.elements.addedDate.value,
    };

    if (currentComponent) {
      setComponents(components.map((component) => (component.id === currentComponent.id ? newComponent : component)));
    } else {
      setComponents([...components, newComponent]);
    }

    handleCloseModal();
  };

  const handleModifyComponent = (event) => {
    event.preventDefault();
    const form = event.target;
    const modifiedComponent = {
      ...currentComponent,
      name: form.elements.name.value,
      totalQuantity: parseInt(form.elements.totalQuantity.value, 10),
      availableQuantity: currentComponent.availableQuantity,
      addedDate: form.elements.addedDate.value,
    };

    const quantityChange = parseInt(form.elements.quantity.value, 10);
    const transactionType = form.elements.transactionType.value;

    if (transactionType === "credit") {
      modifiedComponent.availableQuantity += quantityChange;
    } else if (transactionType === "debit") {
      modifiedComponent.availableQuantity -= quantityChange;
    }

    setComponents(components.map((component) => (component.id === currentComponent.id ? modifiedComponent : component)));
    handleCloseModal();
  };

  const handleDeleteComponent = (id) => {
    setComponents(components.filter((component) => component.id !== id));
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
              <td>{component.name}</td>
              <td>{component.totalQuantity}</td>
              <td>{component.availableQuantity}</td>
              <td>{component.addedDate}</td>
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
        <Form onSubmit={isModify ? handleModifyComponent : handleSaveComponent}>
          <Modal.Body>
            <Form.Group controlId="formComponentName">
              <Form.Label>Component Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={currentComponent?.name || ""} required />
            </Form.Group>
            <Form.Group controlId="formTotalQuantity">
              <Form.Label>Total Quantity</Form.Label>
              <Form.Control type="number" name="totalQuantity" defaultValue={currentComponent?.totalQuantity || ""} required />
            </Form.Group>
            <Form.Group controlId="formAvailableQuantity">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control type="number" name="availableQuantity" defaultValue={currentComponent?.availableQuantity || ""} required />
            </Form.Group>
            <Form.Group controlId="formAddedDate">
              <Form.Label>Added Date</Form.Label>
              <Form.Control type="date" name="addedDate" defaultValue={currentComponent?.addedDate || ""} required />
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