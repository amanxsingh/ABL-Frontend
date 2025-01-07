import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PerformanceChart = () => {
  // Demo data for each exam type
  const examData = {
    UT: {
      labels: ["UT1", "UT2", "UT3", "UT4"],
      datasets: [
        {
          label: "Student Marks",
          data: [18, 17, 16, 20], // Marks for UT1, UT2, UT3, UT4
          backgroundColor: "rgba(75, 192, 192, 0.8)", // Teal
        },
        {
          label: "Average Marks",
          data: [14, 15, 16, 18],
          backgroundColor: "rgba(153, 102, 255, 0.8)", // Purple
        },
        {
          label: "Highest Marks",
          data: [20, 20, 20, 20],
          backgroundColor: "rgba(255, 159, 64, 0.8)", // Orange
        },
      ],
      maxMarks: 20, // UT exams are out of 20
    },
    Yearly: {
      labels: ["Half-Yearly", "Annual Exam"],
      datasets: [
        {
          label: "Student Marks",
          data: [85, 90], // Marks for Half-Yearly and Annual Exam
          backgroundColor: "rgba(75, 192, 192, 0.8)", // Teal
        },
        {
          label: "Average Marks",
          data: [78, 85],
          backgroundColor: "rgba(153, 102, 255, 0.8)", // Purple
        },
        {
          label: "Highest Marks",
          data: [100, 100],
          backgroundColor: "rgba(255, 159, 64, 0.8)", // Orange
        },
      ],
      maxMarks: 100, // Yearly exams are out of 100
    },
  };

  // State to handle dropdown selection and chart data
  const [selectedExam, setSelectedExam] = useState("UT"); // Default is UT
  const [chartData, setChartData] = useState(examData[selectedExam]);

  // Handle exam selection from dropdown
  const handleExamChange = (event) => {
    const selected = event.target.value;
    setSelectedExam(selected);
    setChartData(examData[selected]);
  };

  // Prepare chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: chartData.maxMarks,
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div
      className="chart-section"
      style={{ position: "relative", height: "350px" }}
    >
      {/* Dropdown for selecting exams at top-right */}
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <select
          value={selectedExam}
          onChange={handleExamChange}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
            width: "95px",
          }}
        >
          <option value="UT">UT Exams (Max Marks: 20)</option>
          <option value="Yearly">Yearly Exam (Max Marks: 100)</option>
        </select>
      </div>

      {/* Bar Graph */}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default PerformanceChart;
