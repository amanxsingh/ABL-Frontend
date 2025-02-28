import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/AdvocacyReport.css";

const AdvocacyReport = () => {
  const [reports, setReports] = useState([
    { id: 1, date: "2025-01-01", advocacy: "Advocacy A", file: "fileA.pdf" },
    { id: 2, date: "2025-02-01", advocacy: "Advocacy B", file: "fileB.pdf" },
  ]);

  return (
    <div className="advocacy-report">
      <div className="header">
        <h2>Advocacy Report</h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Advocacy</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.date}</td>
              <td>{report.advocacy}</td>
              <td>
                <a href={`/${report.file}`} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvocacyReport;