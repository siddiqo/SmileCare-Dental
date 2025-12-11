import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { FaUserMd, FaCalendarAlt, FaUsers, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const stats = [
    { icon: FaUserMd, label: 'Total Dentists', value: '8', color: '#4CAF50' },
    { icon: FaUsers, label: 'Total Patients', value: '142', color: '#2196F3' },
    { icon: FaCalendarAlt, label: 'Appointments Today', value: '24', color: '#FF9800' },
    { icon: FaChartLine, label: 'This Month', value: '347', color: '#9C27B0' }
  ];

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h2>Dashboard</h2>
            <p className="text-muted">Welcome to SmileCare Admin Panel</p>
          </div>
        </div>

        <div className="dashboard-stats">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                  <Icon />
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dashboard-content">
          <div className="welcome-section">
            <h3>Welcome to SmileCare Administration</h3>
            <p>
              Manage your dental practice efficiently with our comprehensive admin panel.
              Navigate through the sidebar to access different sections.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
