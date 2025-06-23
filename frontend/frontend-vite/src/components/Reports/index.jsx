import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientReport from './PatientReport';
import MedicalHistory from './MedicalHistory.jsx';

const Reports = () => {
  return (
      <div className="container">
        <h1>Patient Admission Report</h1>
        <Routes>
          <Route path="/patient-report" element={<PatientReport />} />
          <Route path="/medicalHistory/:id" element={<MedicalHistory />} />
        </Routes>
      </div>
  );
};

export default Reports