import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import PatientReport from './PatientReport';
import LoggingReports from './LoggingReports.jsx';
import styles from './reports.module.css';

const ReportsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/reports/patient-report') {
      return location.pathname === '/reports/patient-report';
    }
    if (path === '/reports/loggings') {
      return location.pathname === '/reports/loggings';
    }
    if (path === '/reports/medicalHistory') {
      return location.pathname.includes('/medicalHistory');
    }
    return false;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reports Dashboard</h1>
      
      {/* Navigation Buttons */}
      <div className={styles.navigationBar}>
        <button
          onClick={() => navigate('/reports/patient-report')}
          className={`${styles.navButton} ${isActive('/reports/patient-report') ? styles.navButtonActive : ''}`}
        >
          Patient Reports
        </button>
        <button
          onClick={() => navigate('/reports/loggings')}
          className={`${styles.navButton} ${isActive('/reports/loggings') ? styles.navButtonActive : ''}`}
        >
          User Activity Logs
        </button>
        <button
          onClick={() => navigate('/reports/medicalHistory')}
          className={`${styles.navButton} ${isActive('/reports/medicalHistory') ? styles.navButtonActive : ''}`}
        >
          Medical History
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
};

const Reports = () => {
  return (
    <Routes>
      <Route path="/" element={<ReportsLayout />}>
        <Route path="patient-report" element={<PatientReport />} />
        <Route path="loggings" element={<LoggingReports />} />
        <Route path="medicalHistory" element={<PatientReport />} />
        <Route path=":id/medicalHistory/reports" element={<PatientReport />} />
        <Route index element={<PatientReport />} />
      </Route>
    </Routes>
  );
};

export default Reports