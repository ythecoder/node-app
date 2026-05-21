import React, { useEffect, useState } from "react";
import "./Home.css";

const MOCK_METRICS = [
  { id: 1, title: "Total Students", value: "1,245", trend: "+12.5%", isPositive: true, icon: "🎓" },
  { id: 2, title: "Active Staff", value: "84", trend: "+2.4%", isPositive: true, icon: "👨‍🏫" },
  { id: 3, title: "Avg. Attendance", value: "92%", trend: "-1.1%", isPositive: false, icon: "📅" },
  { id: 4, title: "Total Courses", value: "45", trend: "+5.0%", isPositive: true, icon: "📚" },
];



const RECENT_ACTIVITIES = [
  { id: 1, action: "New student registration", user: "Emma Watson", time: "10 mins ago", type: "success" },
  { id: 2, action: "Course material updated", user: "Dr. Smith", time: "1 hour ago", type: "info" },
  { id: 3, action: "System maintenance", user: "Admin", time: "3 hours ago", type: "warning" },
  { id: 4, action: "Leave request approved", user: "John Doe", time: "5 hours ago", type: "success" },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Analytics Overview</h2>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">Generate Report</button>
        </div>
      </header>

      <div className="metrics-grid">
        {MOCK_METRICS.map(metric => (
          <div className="metric-card" key={metric.id}>
            <div className="metric-header">
              <span className="metric-icon">{metric.icon}</span>
              <span className={`metric-trend ${metric.isPositive ? 'positive' : 'negative'}`}>
                {metric.isPositive ? '↑' : '↓'} {metric.trend}
              </span>
            </div>
            <div className="metric-content">
              <h3>{metric.value}</h3>
              <p>{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h3>Enrollment Trends</h3>
          <div className="mock-chart">
            <div className="bar" style={{ height: '40%' }}><span>Jan</span></div>
            <div className="bar" style={{ height: '60%' }}><span>Feb</span></div>
            <div className="bar" style={{ height: '55%' }}><span>Mar</span></div>
            <div className="bar" style={{ height: '80%' }}><span>Apr</span></div>
            <div className="bar" style={{ height: '70%' }}><span>May</span></div>
            <div className="bar" style={{ height: '95%' }}><span>Jun</span></div>
          </div>
        </div>

        <div className="recent-activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {RECENT_ACTIVITIES.map(activity => (
              <div className="activity-item" key={activity.id}>
                <div className={`activity-indicator ${activity.type}`}></div>
                <div className="activity-details">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-meta">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
