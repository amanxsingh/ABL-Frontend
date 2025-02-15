import { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import styled from "styled-components";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 60% 40%;
  gap: 20px;
  height: 90vh;
  padding: 20px;

  .card-new {
    width: 100%;
    height: 100%;
    border-radius: 30px;
    box-shadow: 10px 10px 20px #bebebe, -10px -10px 20px #ffffff;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    cursor: default; /* Remove hover effect */
  }

  .line-chart-card-new {
    background-color: #f7f7f7; /* Light gray */
  }

  .calendar-card-new {
    background-color: #f0f8ff; /* Alice blue */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .placeholder-card-new {
    background-color: #fffacd; /* Lemon chiffon */
  }

  .bottom-card-new {
    background-color: rgb(197, 255, 197); /* Light green */
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .bottom-left-card-new {
    flex: 1;
    padding: 10px;
    text-align: left;
  }

  .bottom-right-card-new {
    flex: 1;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pie-chart-container-new {
    width: 100%;
    height: 220px; /* Fixed height for pie chart */
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const generateCalendarData = () => {
  const months = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];

  const calendarData = {};

  months.forEach((month, index) => {
    const daysInMonth = new Date(
      2024 + (index < 9 ? 0 : 1),
      ((index + 3) % 12) + 1,
      0
    ).getDate();
    calendarData[month] = {};
    for (let day = 1; day <= daysInMonth; day++) {
      calendarData[month][day] = {
        Scratch: Math.floor(Math.random() * 61),
        Robotics: Math.floor(Math.random() * 61),
      };
    }
  });

  return calendarData;
};

const calendarData = generateCalendarData();

const AssessmentReport = () => {
  const monthData = {
    labels: [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ],
    hours: [20, 25, 15, 18, 19, 22, 23, 17, 19],
  };

  const [selectedMonth, setSelectedMonth] = useState("April");
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 3, 1));
  const [activeStartDate, setActiveStartDate] = useState(new Date(2024, 3, 1));

  useEffect(() => {
    setSelectedMonth("April");
    setSelectedDate(new Date(2024, 3, 1));
    setActiveStartDate(new Date(2024, 3, 1));
  }, []);

  const handleMonthClick = (event, activeElements) => {
    if (activeElements.length > 0) {
      const selectedIndex = activeElements[0].index;
      const month = monthData.labels[selectedIndex];
      setSelectedMonth(month);
      const newDate = new Date(2024, 3 + selectedIndex, 1); // Adjust to start from April 2024
      setSelectedDate(newDate);
      setActiveStartDate(newDate);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const data = {
    labels: monthData.labels,
    datasets: [
      {
        label: "Study Hours",
        data: monthData.hours,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, activeElements) => handleMonthClick(event, activeElements),
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} hours`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 40,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const subjectHours = calendarData[selectedMonth] || {};
  const scratchMinutes = subjectHours[selectedDate.getDate()]?.Scratch || 0;
  const roboticsMinutes = subjectHours[selectedDate.getDate()]?.Robotics || 0;

  const pieData = {
    labels: ["Scratch", "Robotics"],
    datasets: [
      {
        label: "Minutes Distribution",
        data: [scratchMinutes, roboticsMinutes],
        backgroundColor: ["rgb(0, 151, 23)", "rgb(255, 0, 0)"],
        borderColor: ["rgb(197, 255, 197)", "rgb(197, 255, 197)"],
        borderWidth: 2,
        hoverOffset: 10, // Add hoverOffset to make the slice pop out on hover
      },
    ],
  };

  return (
    <StyledWrapper>
      <div className="card-new line-chart-card-new">
        <div style={{ height: "100%", width: "100%", padding: "5px" }}>
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="card-new calendar-card-new">
        {/* <Calendar
          value={selectedDate}
          onClickDay={handleDateClick}
          onActiveStartDateChange={({ activeStartDate }) => {
            setActiveStartDate(activeStartDate);
          }}
          activeStartDate={activeStartDate}
          tileDisabled={({ date }) => {
            const startDate = new Date(2024, 3, 1);
            const endDate = new Date(2025, 2, 31);
            return date < startDate || date > endDate;
          }}
        /> */}
      </div>

      <div className="card-new placeholder-card-new">
        <h3 style={{ padding: "10px", margin: "0" }}>Teachers Comment</h3>
        <p style={{ padding: "10px", margin: "0" }}>
          Your performance is steady, showing a good understanding of the
          basics. <br />
          While your score is average, there’s a lot of potential for
          improvement with consistent effort. <br />
          Focus on refining your skills and challenging yourself to aim
          higher—you can do it!
        </p>
      </div>

      <div className="card-new bottom-card-new">
        <div className="bottom-left-card-new">
          <p>
            <strong>Scratch:</strong> {scratchMinutes} minutes
          </p>
          <p>
            <strong>Robotics:</strong> {roboticsMinutes} minutes
          </p>
        </div>
        <div className="bottom-right-card-new">
          <div className="pie-chart-container-new">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default AssessmentReport;
