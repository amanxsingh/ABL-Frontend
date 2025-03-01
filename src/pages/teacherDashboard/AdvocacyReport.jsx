import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/AdvocacyReport.css";
import { fetchAdvocacyReport } from "../../api/teacherApiService";

const AdvocacyReport = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAdvocacyReport();
      if (result.success) {
        setReports(result.data);
      } else {
        console.error("Failed to fetch advocacy report data:", result.error);
      }
    };

    fetchData();
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleBack = () => {
    setSelectedReport(null);
  };

  return (
    <div className="advocacy-report">
      <div className="header">
        <h2>Advocacy Report</h2>
      </div>
      {selectedReport ? (
        <div>
          <Button variant="primary" onClick={handleBack}>
            Back
          </Button>
          <h3>Advocacy Report Details</h3>
          <table className="table">
            <tbody>
              <tr>
                <td>Date</td>
                <td>{selectedReport.date}</td>
              </tr>
              <tr>
                <td>Name Advocacy</td>
                <td>{selectedReport.name_advocacy}</td>
              </tr>
              <tr>
                <td>Grade</td>
                <td>{selectedReport.grade}</td>
              </tr>
              <tr>
                <td>Section</td>
                <td>{selectedReport.section}</td>
              </tr>
              <tr>
                <td>School</td>
                <td>{selectedReport.school}</td>
              </tr>
              <tr>
                <td>Duration</td>
                <td>{selectedReport.duration}</td>
              </tr>
              <tr>
                <td>Topics</td>
                <td>{selectedReport.topics}</td>
              </tr>
              <tr>
                <td>Topics Microplanner</td>
                <td>{selectedReport.topics_microplanner ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Classroom Management</td>
                <td>{selectedReport.classroom_management}</td>
              </tr>
              <tr>
                <td>Content Delivery</td>
                <td>{selectedReport.content_delievery}</td>
              </tr>
              <tr>
                <td>Student-Teacher Relation</td>
                <td>{selectedReport.student_teacher_relation}</td>
              </tr>
              <tr>
                <td>Dress Code</td>
                <td>{selectedReport.dresscode}</td>
              </tr>
              <tr>
                <td>Handling Communication</td>
                <td>{selectedReport.handling_comm}</td>
              </tr>
              <tr>
                <td>Regularity</td>
                <td>{selectedReport.Regularity}</td>
              </tr>
              <tr>
                <td>Punctuality</td>
                <td>{selectedReport.Punctuality}</td>
              </tr>
              <tr>
                <td>Daily Report</td>
                <td>{selectedReport.daily_report}</td>
              </tr>
              <tr>
                <td>Daily Progress Sheet</td>
                <td>{selectedReport.daily_progress_sheet}</td>
              </tr>
              <tr>
                <td>Overall Behaviour</td>
                <td>{selectedReport.overall_behaviour}</td>
              </tr>
              <tr>
                <td>Next Month Microplanner</td>
                <td>{selectedReport.next_month_microplanner}</td>
              </tr>
              <tr>
                <td>Kreativity Show</td>
                <td>{selectedReport.kreativityshow}</td>
              </tr>
              <tr>
                <td>Compiled Report</td>
                <td>{selectedReport.compiled_report}</td>
              </tr>
              <tr>
                <td>Daily Win Sharing</td>
                <td>{selectedReport.daily_win_sharing}</td>
              </tr>
              <tr>
                <td>Photo/Video Recording</td>
                <td>{selectedReport.photo_video_recording}</td>
              </tr>
              <tr>
                <td>Pedagogical Prowess</td>
                <td>{selectedReport.pedagogical_poweress}</td>
              </tr>
              <tr>
                <td>Additional Info</td>
                <td>{selectedReport.additional_info}</td>
              </tr>
              <tr>
                <td>Project Taken Club</td>
                <td>{selectedReport.project_taken_club}</td>
              </tr>
              <tr>
                <td>Learning Outcomes</td>
                <td>{selectedReport.learning_outcomes}</td>
              </tr>
              <tr>
                <td>Competition</td>
                <td>{selectedReport.competition}</td>
              </tr>
              <tr>
                <td>Feedback</td>
                <td>{selectedReport.feedback}</td>
              </tr>
              <tr>
                <td>Improvement Tips</td>
                <td>{selectedReport.improvement_tips}</td>
              </tr>
              <tr>
                <td>Remarks</td>
                <td>{selectedReport.remarks}</td>
              </tr>
              <tr>
                <td>Verified By</td>
                <td>{selectedReport.verified_by ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Gallery</td>
                <td>
                  <a href={selectedReport.gallery} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name Advocacy</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.date}</td>
                <td>{report.name_advocacy}</td>
                <td>
                  <Button variant="link" onClick={() => handleViewReport(report)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdvocacyReport;