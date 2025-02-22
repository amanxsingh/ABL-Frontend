import React, { useEffect, useState } from "react";
import { fetchStudentAccessReport } from "../../api/apiservice";
import Loader from "../../UIcomponents/dashboard/loader";
import "../../utils/css/studentAccessReport.css";

const StudentAccessReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const result = await fetchStudentAccessReport();
        if (result.success) {
          setReportData(result.data);
        } else {
          setError("An error occurred while fetching student access report data.");
        }
      } catch (error) {
        setError("An error occurred while fetching student access report data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  const { grade_counts, students_by_grade_and_section } = reportData || {};

  return (
    <div className="student-access-report">
      <h2>Student Access Report</h2>
      <div className="grade-counts">
        <h3>Grade Counts</h3>
        <ul>
          {grade_counts && Object.entries(grade_counts).map(([grade, count]) => (
            <li key={grade}>Grade {grade}: {count} students</li>
          ))}
        </ul>
      </div>
      <div className="students-by-grade-and-section">
        <h3>Students by Grade and Section</h3>
        {students_by_grade_and_section && Object.entries(students_by_grade_and_section).map(([grade, gradeData]) => (
          <div key={grade} className="grade-section">
            <h4>Grade {grade}</h4>
            {Object.entries(gradeData.sections).map(([section, students]) => (
              <div key={section} className="section">
                <h5>Section {section}</h5>
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>School</th>
                      <th>Login IP</th>
                      <th>Login DateTime</th>
                      <th>Login Status</th>
                      <th>Page Visited</th>
                      <th>Curriculum Time Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.user.username}>
                        <td>{student.user.username}</td>
                        <td>{student.name}</td>
                        <td>{student.user.email}</td>
                        <td>{student.user.role}</td>
                        <td>{student.school}</td>
                        <td>{student.login_activity?.login_IP || "N/A"}</td>
                        <td>{student.login_activity?.login_datetime || "N/A"}</td>
                        <td>{student.login_activity?.status || "N/A"}</td>
                        <td>{student.access_data?.page_visited || "N/A"}</td>
                        <td>{student.access_data?.curriculum_time_spent || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAccessReport;