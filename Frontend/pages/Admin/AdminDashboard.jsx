import React from "react";
import { FiBell, FiUser } from "react-icons/fi";
import "../../styles/Admin.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="sidebar">
          {/* Logo */}
          <div className="logo">
            <img src="/assets/issalonlogo.jpg" alt="infinitysalon" />
          </div>
          {/* User Profile */}
          <div className="user-profile">
            <button className="header-profile-btn" aria-label="Profile">
              <span className="header-profile-avatar">
                <FiUser size={24} />
              </span>
            </button>
            <div className="user-info">
              <div className="user-name">Name</div>
              <div className="user-role">Role</div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="navigation">
            <div className="nav-item active">Dashboard</div>
            <div className="nav-item">Manage Account</div>
            <div className="nav-item">Posted Content</div>
            <div className="nav-item">Approval of Task</div>
          </nav>
        </div>
        <div className="main-content">
          {/* Header */}
          <div className="header">
            <div className="header-actions" style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <button className="notification-bell" aria-label="Notifications" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
                <FiBell size={24} />
              </button>
              <button className="header-profile-btn" aria-label="Profile">
                <span className="header-profile-avatar">
                  <FiUser size={24} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Admin Footer (self-contained, always at bottom) */}
      <footer className="admin-dashboard-footer">
        <div className="admin-dashboard-footer-container">
          <div className="admin-dashboard-footer-left">
            <img src="/assets/issalonnails.png" alt="infinitysalon" className="admin-dashboard-footer-logo" />
          </div>
          <div className="admin-dashboard-footer-links">
            <svg className="admin-dashboard-facebook-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <a href="#" className="admin-dashboard-footer-link">Terms & Condition</a>
            <a href="#" className="admin-dashboard-footer-link">Policy Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard; 