import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../utils/css/Teacher CSS/TDContent.css";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchTeacherDashboard } from "../../api/teacherApiService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TeacherDashboardContent = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [notifications, setNotifications] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [learnerCount, setLearnerCount] = useState(0);
  const [activeLearnerCount, setActiveLearnerCount] = useState(0);
  const [activeHomeworkCount, setActiveHomeworkCount] = useState(0);
  const [lmsEngagementData, setLmsEngagementData] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    // Fetch notifications count from an API or set it to 0 if not fetching
    const fetchNotifications = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data.count || 0);
        setNotificationList(data.notifications || []);
      } catch (error) {
        setNotifications(0);
        setNotificationList([]);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await fetchTeacherDashboard("teacher10");
        if (result.success) {
          const data = result.data;
          setLearnerCount(data.learner_count);
          setActiveLearnerCount(data.active_learner_count);
          setActiveHomeworkCount(data.active_homework_count);
          setLmsEngagementData(data.lms_engagement);

          // Extract available months from LMS engagement data
          const months = Array.from(new Set(data.lms_engagement.map(item => item.login_date.slice(0, 7))));
          setAvailableMonths(months);
          setSelectedMonth(months[0]); // Set the first available month as the default selected month
        } else {
          console.error("Failed to fetch dashboard data:", result.error);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const processLmsEngagementData = (engagementData, month) => {
    const engagementCountByDate = engagementData.reduce((acc, engagement) => {
      const date = engagement.login_date;
      if (date.startsWith(month)) {
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
      }
      return acc;
    }, {});

    const labels = Object.keys(engagementCountByDate).sort();
    const data = labels.map((date) => engagementCountByDate[date]);

    return { labels, data };
  };

  const { labels, data } = processLmsEngagementData(lmsEngagementData, selectedMonth);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Engagement Count',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="teacher-dashboard-content">
      <div className="top-bar">
        <div className="top-bar-left">
          {[
            { number: activeLearnerCount, text: "Active Learner" },
            { number: activeHomeworkCount, text: "Active Homework" },
            { number: learnerCount, text: "Total Learner" },
          ].map((item, index) => (
            <div key={index} className="top-bar-card">
              <div className="number">{item.number}</div>
              <div className="text">{item.text}</div>
            </div>
          ))}
        </div>
        <div className="top-bar-right">
          <div className="notification-icon" onClick={handleNotificationClick} ref={notificationRef}>
            <i className="bi bi-bell"></i>
            <span className="notification-count">{notifications}</span>
            {showNotifications && (
              <div className="notification-dropdown">
                {notificationList.length > 0 ? (
                  notificationList.map((notification, index) => (
                    <div key={index} className="notification-item">
                      {notification.message}
                    </div>
                  ))
                ) : (
                  <div className="notification-item">No new notifications</div>
                )}
              </div>
            )}
          </div>
          <Dropdown show={showDropdown} onToggle={handleDropdownToggle}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <i className="bi bi-gear"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
              <Dropdown.Item href="#/my-reflections">My Reflections</Dropdown.Item>
              <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="cards-container">
        <div className="content-card">
          <h3>Overview</h3>
          <div className="inner-cards-container">
            {[
              { number: 10, text: "Subjects" },
              { number: 5, text: "Assigned Assessment" },
              { number: 100, text: "Assigned HW" },
              { number: 3, text: "Extra" },
            ].map((item, index) => (
              <div key={index} className="inner-card">
                <div className="number">{item.number}</div>
                <div className="text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="content-card">
          <h3>Quick Activities</h3>
          <div className="inner-cards-container">
            {[
              { text: "Add Subjects" },
              { text: "Push Homework" },
              { text: "Add Lesson" },
              { text: "Add User" },
            ].map((item, index) => (
              <div key={index} className="inner-card">
                <div className="text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="content-card">
          <h3>Recent Activities</h3>
          <ul>
            <li>Activity 1: Lorem ipsum dolor sit amet.</li>
            <li>Activity 2: Consectetur adipiscing elit.</li>
            <li>Activity 3: Integer molestie lorem at massa.</li>
            <li>Activity 4: Facilisis in pretium nisl aliquet.</li>
          </ul>
        </div>
        <div className="content-card">
          <div className="lms-engagement-header">
            <h3>LMS Engagement</h3>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedMonth}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {availableMonths.map((month) => (
                  <Dropdown.Item key={month} onClick={() => handleMonthChange(month)}>
                    {month}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="chart-container">
            <Line data={lineChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardContent;