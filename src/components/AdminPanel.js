import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = ({ children }) => {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [openMenus, setOpenMenus] = useState({ patient: true, doctor: false, admin: false });

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleSubMenu = (menu) => {
    if (!isMinimized) {
      setOpenMenus(prev => {
        const isAlreadyOpen = !!prev[menu];
        const newOpenMenus = { patient: false, doctor: false, admin: false };
        if (!isAlreadyOpen) {
          newOpenMenus[menu] = true;
        }
        return newOpenMenus;
      });
    }
  };

  return (
    <div className={`admin-panel d-flex ${isMinimized ? 'sidebar-minimized' : ''}`} style={{ background: '#f8fbff' }}>
      {/* Sidebar */}
      <aside className="sidebar bg-white">
        <div className="sidebar-logo d-flex align-items-center justify-content-center px-3" style={{ height: '71px' }}>
          <img src="/logo192.png" alt="Clinic Logo" style={{ width: 40, height: 40 }} />
          <h5 className="sidebar-title ms-3 mb-0" style={{ color: '#1976d2' }}>ClinicApp</h5>
        </div>
        <nav className="sidebar-menu mt-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <div className="nav-link fw-bold text-primary d-flex justify-content-between align-items-center" onClick={() => toggleSubMenu('admin')}>
                <span><i className="bi bi-person-gear me-2"></i>Admin</span>
                <i className={`bi bi-chevron-down transition-transform ${openMenus.admin ? 'rotate-180' : ''}`}></i>
              </div>
              {openMenus.admin && !isMinimized && (
                <ul className="nav flex-column ms-3">
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} to="/admin">
                      <i className="bi bi-person-badge-fill me-2"></i>
                      <span>Manage Doctors</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/admin-patients' ? 'active' : ''}`} to="/admin-patients">
                      <i className="bi bi-people-fill me-2"></i>
                      <span>Manage Patients</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/admin-medications' ? 'active' : ''}`} to="/admin-medications">
                      <i className="bi bi-capsule me-2"></i>
                      <span>Manage Medications</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item mt-3">
              <div className="nav-link fw-bold text-primary d-flex justify-content-between align-items-center" onClick={() => toggleSubMenu('patient')}>
                <span><i className="bi bi-person-fill me-2"></i>Patient</span>
                <i className={`bi bi-chevron-down transition-transform ${openMenus.patient ? 'rotate-180' : ''}`}></i>
              </div>
              {openMenus.patient && !isMinimized && (
                <ul className="nav flex-column ms-3">
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`} to="/register">
                      <i className="bi bi-person-plus-fill me-2"></i>
                      <span>Register</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/admin-schedule' ? 'active' : ''}`} to="/admin-schedule">
                      <i className="bi bi-calendar-plus-fill me-2"></i>
                      <span>Appointments</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item mt-3">
              <div className="nav-link fw-bold text-primary d-flex justify-content-between align-items-center" onClick={() => toggleSubMenu('doctor')}>
                <span><i className="bi bi-heart-pulse-fill me-2"></i>Doctor</span>
                <i className={`bi bi-chevron-down transition-transform ${openMenus.doctor ? 'rotate-180' : ''}`}></i>
              </div>
              {openMenus.doctor && !isMinimized && (
                <ul className="nav flex-column ms-3">
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/doctor' ? 'active' : ''}`} to="/doctor">
                      <i className="bi bi-calendar-day-fill me-2"></i>
                      <span>Daily Appointments</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/doctor-notes' ? 'active' : ''}`} to="/doctor-notes">
                      <i className="bi bi-journal-text me-2"></i>
                      <span>Consultation Notes</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/doctor-review' ? 'active' : ''}`} to="/doctor-review">
                      <i className="bi bi-file-earmark-medical-fill me-2"></i>
                      <span>Review History</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom bg-white">
          <div className="d-flex align-items-center">
            <button className="btn btn-light me-3" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
            <h4 className="mb-0" style={{ color: '#1976d2' }}>Admin Panel</h4>
          </div>
          <button className="btn btn-outline-primary">Logout</button>
        </header>
        {/* Page Content */}
        <main className="flex-grow-1 p-4" style={{ background: '#f8fbff' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
