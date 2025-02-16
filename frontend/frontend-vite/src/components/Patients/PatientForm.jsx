import React, { useState } from 'react';
import styles from './Patients.module.css';

const PatientForm = ({ onSubmit }) => {
  const [newPatient, setNewPatient] = useState({
    name: '',
    date_of_birth: '',
    address: '',
    admission_date: '',
    discharge_date: '',
    status: 'Admitted',
    current_condition: '',
    phone: '',
    email: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    is_active: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPatient);
    // Reset form
    setNewPatient({
      name: '',
      date_of_birth: '',
      address: '',
      admission_date: '',
      discharge_date: '',
      status: 'Admitted',
      current_condition: '',
      phone: '',
      email: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      is_active: 'Active'
    });
  };

  return (
    <div className={styles.patientManagement}>
      <h1>Add New Patient</h1>
      <form onSubmit={handleSubmit} className={styles.patientForm}>
        <label>
          Name:
          <input type="text" name="name" value={newPatient.name} onChange={handleInputChange} required />
        </label>
        {/* ... other form fields ... */}
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
};

export default PatientForm; 