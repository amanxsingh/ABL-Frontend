import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/ClassroomGallery.css";

const ClassroomGallery = () => {
  const [galleries, setGalleries] = useState([
    { id: 1, lastModified: "2025-01-01", file: "gallery1.pdf" },
    { id: 2, lastModified: "2025-02-01", file: "gallery2.pdf" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentGallery, setCurrentGallery] = useState(null);

  const handleShowModal = (gallery = null) => {
    setCurrentGallery(gallery);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentGallery(null);
  };

  const handleSaveGallery = (event) => {
    event.preventDefault();
    const form = event.target;
    const newGallery = {
      id: currentGallery ? currentGallery.id : galleries.length + 1,
      lastModified: form.elements.date.value,
      file: form.elements.file.files[0].name,
    };

    if (currentGallery) {
      setGalleries(galleries.map((gallery) => (gallery.id === currentGallery.id ? newGallery : gallery)));
    } else {
      setGalleries([...galleries, newGallery]);
    }

    handleCloseModal();
  };

  return (
    <div className="classroom-gallery">
      <div className="header">
        <h2>Classroom Gallery</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Gallery
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Last Modified</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {galleries.map((gallery) => (
            <tr key={gallery.id}>
              <td>{gallery.lastModified}</td>
              <td>
                <a href={`/${gallery.file}`} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentGallery ? "Modify Gallery" : "Add Gallery"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveGallery}>
          <Modal.Body>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" defaultValue={currentGallery?.lastModified || ""} required />
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
              {currentGallery ? "Save Changes" : "Add Gallery"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassroomGallery;