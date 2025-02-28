import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/MonthlyReport.css";

const MonthlyReport = () => {
  const [reports, setReports] = useState([
    { id: 1, date: "2025-01-01", month: "January", file: "file1.pdf" },
    { id: 2, date: "2025-02-01", month: "February", file: "file2.pdf" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const handleShowModal = (report = null) => {
    setCurrentReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentReport(null);
  };

  const handleSaveReport = (event) => {
    event.preventDefault();
    const form = event.target;
    const newReport = {
      id: currentReport ? currentReport.id : reports.length + 1,
      date: form.elements.date.value,
      month: form.elements.month.value,
      file: form.elements.file.files[0].name,
    };

    if (currentReport) {
      setReports(reports.map((report) => (report.id === currentReport.id ? newReport : report)));
    } else {
      setReports([...reports, newReport]);
    }

    handleCloseModal();
  };

  return (
    <div className="monthly-report">
      <div className="header">
        <h2>Monthly Report</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Monthly Report
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Month</th>
            <th>View</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.date}</td>
              <td>{report.month}</td>
              <td>
                <a href={`/${report.file}`} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>
                <Button variant="secondary" onClick={() => handleShowModal(report)}>
                  Modify
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentReport ? "Modify Monthly Report" : "Add Monthly Report"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveReport}>
          <Modal.Body>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" defaultValue={currentReport?.date || ""} required />
            </Form.Group>
            <Form.Group controlId="formMonth">
              <Form.Label>Month</Form.Label>
              <Form.Control as="select" name="month" defaultValue={currentReport?.month || ""} required>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                  <option key={month} value={month}>
                    {month}
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
              {currentReport ? "Save Changes" : "Add Monthly Report"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MonthlyReport;