import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUsers, FaUserMd, FaSignOutAlt, FaUser } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('smileCareUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const navItems = [
    { path: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/appointments', icon: FaCalendarAlt, label: 'Appointments' },
    { path: '/admin/patients', icon: FaUsers, label: 'Patients' },
    { path: '/admin/dentists', icon: FaUserMd, label: 'Dentists' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('smileCareUser');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>SmileCare Admin</h3>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <FaUser className="user-icon" />
            <div className="user-details">
              <div className="user-name">{user?.name || 'Admin User'}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
