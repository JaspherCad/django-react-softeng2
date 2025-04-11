import React, { useState } from 'react';
import styles from './Patients.module.css';
import { useNavigate, useParams } from 'react-router-dom'
//EACH PATIENT PER .MAP() has this
//     name: '',
//     date_of_birth: '',
//     address: '',
//     admission_date: '',
//     discharge_date: '',
//     status: 'Admitted',
//     current_condition: '',
//     phone: '',
//     email: '',
//     emergency_contact_name: '',
//     emergency_contact_phone: '',
//     is_active: 'Active'


const PatientList = ({ patients, selectedPatient, setSelectedPatient }) => {
   
  const navigate = useNavigate() 
  // const [selectedPatient, setSelectedPatient] = useState(null); //move to upper state so we can reuse for edit, specific views, etc
  const [showModal, setShowModal] = useState(false);
  console.log(patients)
  const handleRowClick = (patient) => {
    setSelectedPatient(patient); //send this info to parent
    setShowModal(true);
  };

  
  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleEditClick = (patient, e) => {
    e.stopPropagation(); // Prevent row click when clicking button
    setSelectedPatient(patient);
    navigate(`/patients/edit/${patient.id}`);
  }

  return (
    <div className={styles.patientManagement}>
      <div className={styles.container}>
        <div className={styles.tableContent}>
          <h2>Patient Records</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Admission</th>
                <th>Status</th>
                <th>Phone</th>
                <th colSpan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients && patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handleRowClick(patient)}
                    className={styles.tableRow}
                  >
                    <td data-label="Patient Id">{index + 1}</td>
                    <td data-label="Name">{patient.name}</td>
                    <td data-label="Admission_Date">{patient.admission_date}</td>
                    <td data-label="Status">{patient.status}</td>
                    <td data-label="Phone">{patient.phone}</td>
                    <td data-label="Edit">
                      <button 
                        className={styles.btnEdit}
                        onClick={(e) => handleEditClick(patient, e)} // Prevent row click when clicking button
                      >
                        <i className="fa fa-pencil"></i>Edit
                      </button>
                    </td>
                    <td data-label="Delete">
                      <button 
                        className={styles.btnTrash}
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking button
                      >
                        <i className="fa fa-trash"></i>Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details Modal */}
      {/* WHERE SELECTED PATIENT FROM?????? the PARENT.. CRUD AND ALL UTILITY IS OVER THER>>> */}
      {showModal && selectedPatient && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Patient Details</h2>
              <button className={styles.closeButton} onClick={closeModal}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.patientDetail}>
                <strong>Name:</strong> {selectedPatient.name}
              </div>
              <div className={styles.patientDetail}>
                <strong>Date of Birth:</strong> {selectedPatient.date_of_birth}
              </div>
              <div className={styles.patientDetail}>
                <strong>Address:</strong> {selectedPatient.address}
              </div>
              <div className={styles.patientDetail}>
                <strong>Admission Date:</strong> {selectedPatient.admission_date}
              </div>
              <div className={styles.patientDetail}>
                <strong>Discharge Date:</strong> {selectedPatient.discharge_date || 'N/A'}
              </div>
              <div className={styles.patientDetail}>
                <strong>Status:</strong> {selectedPatient.status}
              </div>
              <div className={styles.patientDetail}>
                <strong>Current Condition:</strong> {selectedPatient.current_condition}
              </div>
              <div className={styles.patientDetail}>
                <strong>Phone:</strong> {selectedPatient.phone}
              </div>
              <div className={styles.patientDetail}>
                <strong>Email:</strong> {selectedPatient.email}
              </div>
              <div className={styles.patientDetail}>
                <strong>Emergency Contact:</strong> {selectedPatient.emergency_contact_name}
              </div>
              <div className={styles.patientDetail}>
                <strong>Emergency Phone:</strong> {selectedPatient.emergency_contact_phone}
              </div>
              <div className={styles.patientDetail}>
                <strong>Active Status:</strong> {selectedPatient.is_active}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList; 