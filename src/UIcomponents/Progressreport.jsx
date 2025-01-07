import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useState } from "react";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

// Dummy data for different exams
const examData = {
  UT1: {
    totalQuestions: 11,
    studentMarks: 18,
    correct: 9,
    wrong: 1,
    unattempted: 1,
    topicsProgress: [
      { topic: "AI Basics", progress: 60 },
      { topic: "Machine Learning", progress: 50 },
      { topic: "Neural Networks", progress: 70 },
      { topic: "Computer Vision", progress: 65 },
      { topic: "Natural Language Processing", progress: 55 },
      { topic: "Deep Learning", progress: 60 },
      { topic: "Reinforcement Learning", progress: 40 },
      { topic: "AI Ethics", progress: 50 },
    ],
  },
  UT2: {
    totalQuestions: 12,
    studentMarks: 17,
    correct: 9,
    wrong: 1,
    unattempted: 2,
    topicsProgress: [
      { topic: "AI Basics", progress: 70 },
      { topic: "Machine Learning", progress: 65 },
      { topic: "Neural Networks", progress: 80 },
      { topic: "Computer Vision", progress: 75 },
      { topic: "Natural Language Processing", progress: 60 },
      { topic: "Deep Learning", progress: 65 },
      { topic: "Reinforcement Learning", progress: 50 },
      { topic: "AI Ethics", progress: 65 },
    ],
  },
  UT3: {
    totalQuestions: 10,
    studentMarks: 16,
    correct: 8,
    wrong: 1,
    unattempted: 1,
    topicsProgress: [
      { topic: "AI Basics", progress: 50 },
      { topic: "Machine Learning", progress: 45 },
      { topic: "Neural Networks", progress: 60 },
      { topic: "Computer Vision", progress: 55 },
      { topic: "Natural Language Processing", progress: 45 },
      { topic: "Deep Learning", progress: 50 },
      { topic: "Reinforcement Learning", progress: 35 },
      { topic: "AI Ethics", progress: 45 },
    ],
  },
  UT4: {
    totalQuestions: 10,
    studentMarks: 20,
    correct: 10,
    wrong: 0,
    unattempted: 0,
    topicsProgress: [
      { topic: "AI Basics", progress: 65 },
      { topic: "Machine Learning", progress: 60 },
      { topic: "Neural Networks", progress: 75 },
      { topic: "Computer Vision", progress: 70 },
      { topic: "Natural Language Processing", progress: 60 },
      { topic: "Deep Learning", progress: 65 },
      { topic: "Reinforcement Learning", progress: 50 },
      { topic: "AI Ethics", progress: 60 },
    ],
  },
  HalfYearly: {
    totalQuestions: 100,
    studentMarks: 85,
    correct: 85,
    wrong: 10,
    unattempted: 5,
    topicsProgress: [
      { topic: "AI Basics", progress: 80 },
      { topic: "Machine Learning", progress: 75 },
      { topic: "Neural Networks", progress: 85 },
      { topic: "Computer Vision", progress: 90 },
      { topic: "Natural Language Processing", progress: 70 },
      { topic: "Deep Learning", progress: 75 },
      { topic: "Reinforcement Learning", progress: 60 },
      { topic: "AI Ethics", progress: 85 },
    ],
  },
  AnnualExam: {
    totalQuestions: 100,
    studentMarks: 90,
    correct: 90,
    wrong: 7,
    unattempted: 3,
    topicsProgress: [
      { topic: "AI Basics", progress: 90 },
      { topic: "Machine Learning", progress: 85 },
      { topic: "Neural Networks", progress: 95 },
      { topic: "Computer Vision", progress: 92 },
      { topic: "Natural Language Processing", progress: 80 },
      { topic: "Deep Learning", progress: 85 },
      { topic: "Reinforcement Learning", progress: 80 },
      { topic: "AI Ethics", progress: 95 },
    ],
  },
};

// Data for the bar chart
const chartData = {
  labels: ["UT1", "UT2", "UT3", "UT4", "HalfYearly", "AnnualExam"],
  datasets: [
    {
      label: "Student Marks",
      data: [18, 17, 16, 20, 85, 90],
      backgroundColor: "rgba(75, 192, 192, 0.8)", // Teal
    },
    {
      label: "Average Marks",
      data: [14, 15, 16, 18, 78, 85],
      backgroundColor: "rgba(153, 102, 255, 0.8)", // Purple
    },
    {
      label: "Highest Marks",
      data: [20, 20, 20, 20, 100, 100],
      backgroundColor: "rgba(255, 159, 64, 0.8)", // Orange
    },
  ],
};

const ProgressReport = () => {
  const [clickedExam, setClickedExam] = useState("UT1"); // Default exam
  const [examMarks, setExamMarks] = useState(examData["UT1"]);

  // Handle chart click event
  const handleChartClick = (event, chartElement) => {
    const activeElement = chartElement[0];

    if (activeElement) {
      const index = activeElement.index;
      const selectedExam = chartData.labels[index];

      // Ensure that the exam data exists before setting it
      if (examData[selectedExam]) {
        setClickedExam(selectedExam);
        setExamMarks(examData[selectedExam]);
      } else {
        console.error(`No data available for selected exam: ${selectedExam}`);
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    onClick: handleChartClick,
  };

  // Data for the pie chart
  const pieChartData = {
    labels: ["Correct", "Wrong", "Unattempted"],
    datasets: [
      {
        label: "Exam Performance",
        data: [examMarks.correct, examMarks.wrong, examMarks.unattempted],
        backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      {/* Chart Section */}
      <div className="chart-section" style={{ height: "280px", width: "100%" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Cards Below Chart */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          height: "40%",
        }}
      >
        {/* Marks Overview Card */}
        <div
          style={{
            width: "48%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "50%" }}>
            <h4>Marks Overview</h4>
            <h5
              style={{ marginTop: "20px", fontStyle: "italic", color: "#555" }}
            >
              Selected Exam: {clickedExam}
            </h5>
            <br />
            <p>
              <strong>Total Questions:</strong> {examMarks.totalQuestions}
            </p>
            <p>
              <strong>Student Marks:</strong> {examMarks.studentMarks}
            </p>
            <p>
              <strong>Correct Questions:</strong> {examMarks.correct}
            </p>
            <p>
              <strong>Wrong Questions:</strong> {examMarks.wrong}
            </p>
            <p>
              <strong>Unattempted Questions:</strong> {examMarks.unattempted}
            </p>
          </div>
          <div
            style={{
              width: "45%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pie data={pieChartData} />
          </div>
        </div>

        {/* Topics Progress Card */}
        <div
          style={{
            width: "48%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            height: "100%",
          }}
        >
          <h4>Topic Progress</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              height: "100%",
            }}
          >
            {examMarks.topicsProgress?.map((topic, index) => (
              <div key={index} style={{ textAlign: "center", height: "60px" }}>
                <p>{topic.topic}</p>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#ddd",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: `${topic.progress}%`,
                      height: "100%",
                      backgroundColor: "green",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;
