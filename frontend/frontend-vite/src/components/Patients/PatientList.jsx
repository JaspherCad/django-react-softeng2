import React from 'react';
import styles from './Patients.module.css';

const PatientList = ({ patients }) => {
  return (
    <div className={styles.patientManagement}>
      <h1>Patient Records</h1>
      <div className={styles.patientList}>
        {patients.map((patient, index) => (
          <div key={index} className={styles.patientCard}>
            <h3>{patient.name}</h3>
            <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Status:</strong> {patient.status}</p>
            <p><strong>Current Condition:</strong> {patient.current_condition}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Emergency Contact:</strong> {patient.emergency_contact_name} ({patient.emergency_contact_phone})</p>
            <p><strong>Is Active:</strong> {patient.is_active}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList; 