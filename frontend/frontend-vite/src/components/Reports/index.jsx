import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientReport from './PatientReport';
import LoggingReports from './LoggingReports.jsx';

const Reports = () => {
  return (
      <div className="container">
        <h1>Patient Admission Report</h1>
        <Routes>
          <Route path="/patient-report" element={<PatientReport />} />
          <Route path="/loggings" element={<LoggingReports />} />



          <Route path="/medicalHistory" element={<PatientReport />} />
          <Route path="/:id/medicalHistory/reports" element={<PatientReport />} />


        </Routes>
      </div>
  );
};

export default Reports