// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import PatientReport from "./PatientReport";
// import LoggingReports from "./LoggingReports.jsx";
// import MedicalHistory from "./MedicalHistory.jsx";

// const Reports = () => {
//   return (
//     <div className="container">
//       <h1>Choose Report</h1>
//       <Routes>
//         <Route path="/patientReport" element={<PatientReport />} />
//         <Route path="/loggings" element={<LoggingReports />} />

//         <Route path="/medicalHistory" element={<MedicalHistory />} />
//         <Route path="/:id/medicalHistory/reports" element={<PatientReport />} />
//       </Routes>
//     </div>
//   );
// };

// export default Reports;

import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import PatientReport from "./PatientReport";
import LoggingReports from "./LoggingReports.jsx";
import MedicalHistory from "./MedicalHistory.jsx";

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ marginBottom: "1.5rem" }}>Choose Report</h1>

      {/* Button Row */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          style={buttonStyle}
          onClick={() => navigate("/reports/loggings")}
        >
          User Logs
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate("/reports/patientReport")}
        >
          Patient Admission
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate("/reports/medicalHistory")}
        >
          Patient Medical History
        </button>
      </div>

      {/* Content Area */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          minHeight: "300px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Routes>
          <Route path="patientReport" element={<PatientReport />} />
          <Route path="loggings" element={<LoggingReports />} />
          <Route path="medicalHistory" element={<MedicalHistory />} />
          <Route
            path=":id/medicalHistory/reports"
            element={<PatientReport />}
          />
        </Routes>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #4CAF50",
  backgroundColor: "#4CAF50",
  color: "#fff",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default Reports;
