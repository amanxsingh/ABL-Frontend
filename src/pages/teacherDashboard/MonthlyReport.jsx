import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/MonthlyReport.css";
import { fetchMonthlyReports, createMonthlyReport, updateMonthlyReport, deleteMonthlyReport } from "../../api/teacherApiService";

const MonthlyReport = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const result = await fetchMonthlyReports();
      if (result.success) {
        setReports(result.data);
      } else {
        console.error("Failed to fetch monthly reports:", result.error);
      }
    };

    fetchReports();
  }, []);

  const handleShowModal = (report = null) => {
    setCurrentReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentReport(null);
  };

  const handleSaveReport = async (event) => {
    event.preventDefault();
    const form = event.target;
    const newReport = {
      id: currentReport ? currentReport.id : reports.length + 1,
      date: form.elements.date.value,
      month: form.elements.month.value,
      school: "Your School Name", // Replace with actual school name if available
      monthly_report: form.elements.file.files[0].name,
    };

    if (currentReport) {
      const result = await updateMonthlyReport(newReport);
      if (result.success) {
        setReports(reports.map((report) => (report.id === currentReport.id ? newReport : report)));
      } else {
        console.error("Failed to update monthly report:", result.error);
      }
    } else {
      const result = await createMonthlyReport(newReport);
      if (result.success) {
        setReports([...reports, newReport]);
      } else {
        console.error("Failed to create monthly report:", result.error);
      }
    }

    handleCloseModal();
  };

  const handleDeleteReport = async (id) => {
    const result = await deleteMonthlyReport(id);
    if (result.success) {
      setReports(reports.filter((report) => report.id !== id));
    } else {
      console.error("Failed to delete monthly report:", result.error);
    }
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.date}</td>
              <td>{report.month}</td>
              <td>
                <a href={report.monthly_report} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>
                <Button variant="secondary" onClick={() => handleShowModal(report)}>
                  Modify
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteReport(report.id)}>
                  Delete
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