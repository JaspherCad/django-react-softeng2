import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BothPatientForm.module.css';

const ModalOverview = ({ patient, onClose }) => {
  const navigate = useNavigate();
  
  // Determine if patient is outpatient 
  const isOutpatient = patient?.visit_type === "Outpatient";
  
  if (!patient) return null;

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format datetime helper function
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderInpatientView = () => (
    <>
      {/* Personal Information */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.name || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Gender</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.gender || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date of Birth</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={formatDate(patient.date_of_birth) || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Age</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.age || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Birth Place</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.birth_place || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Civil Status</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.civil_status || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nationality</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.nationality || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Religion</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.religion || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Occupation</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.occupation || '-'} readOnly />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Address</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.address || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.phone || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* Case Information */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Case Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Case Number</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.case_number || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Hospital Case Number</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.hospital_case_number || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Code</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.code || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ward/Service</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.ward_service || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Bed Number</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.bed_number || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>PhilHealth Member</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.has_philhealth ? 'Yes' : 'No'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>HMO</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.hmo || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Membership</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.membership || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* Admission Details */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Admission Details</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Type of Admission</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.type_of_admission || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Visit Type</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.visit_type || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Admission Date</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={formatDateTime(patient.admission_date) || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Discharge Date</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={formatDateTime(patient.discharge_date) || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Total Days</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.total_days || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Condition</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.current_condition || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* Medical Details */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Medical Details</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Referred By</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.referred_by || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>ICD Code</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.icd_code || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Diagnosis</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.diagnosis || '-'} readOnly />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Principal Diagnosis</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.principal_diagnosis || '-'} readOnly rows="2"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Other Diagnosis</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.other_diagnosis || '-'} readOnly rows="2"></textarea>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Principal Operation</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.principal_operation || '-'} readOnly rows="2"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Other Operation</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.other_operation || '-'} readOnly rows="2"></textarea>
          </div>
        </div>
      </div>

      {/* Vital Signs */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Vital Signs</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Height</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.height || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Weight</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.weight || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Blood Pressure</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.blood_pressure || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Pulse Rate</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.pulse_rate || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Respiratory Rate</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.respiratory_rate || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Temperature</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.temperature || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* Family Information */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Family Information</h2>
        
        <div className={styles.familySubsection}>
          <h3 className={styles.subsectionTitle}>Father's Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.father_name || '-'} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Address</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.father_address || '-'} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contact Number</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.father_contact || '-'} readOnly />
            </div>
          </div>
        </div>
        
        <div className={styles.familySubsection}>
          <h3 className={styles.subsectionTitle}>Mother's Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.mother_name || '-'} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Address</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.mother_address || '-'} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contact Number</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.mother_contact || '-'} readOnly />
            </div>
          </div>
        </div>
        
        <div className={styles.familySubsection}>
          <h3 className={styles.subsectionTitle}>Spouse's Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.spouse_name || '-'} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Address</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.spouse_address || '-'} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contact Number</label>
              <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.spouse_contact || '-'} readOnly />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderOutpatientView = () => (
    <>
      {/* Personal Information */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.name || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Gender</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.gender || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date of Birth</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={formatDate(patient.date_of_birth) || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Age</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.age || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Address</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.address || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.phone || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* Consultation Information - Specific to Outpatient */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Consultation Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Case Number</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.case_number || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Visit Type</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.visit_type || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Consultation Date</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={formatDateTime(patient.consultation_datetime) || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Next Consultation</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={formatDate(patient.next_consultation_date) || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Referred By</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.referred_by || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Condition</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.current_condition || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* Medical Details */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Medical Assessment</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Main Complaint</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.main_complaint || '-'} readOnly rows="2"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Present Illness</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.present_illness || '-'} readOnly rows="2"></textarea>
          </div>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Diagnosis</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.diagnosis || '-'} readOnly rows="2"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>ICD Code</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.icd_code || '-'} readOnly />
          </div>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Treatment</label>
            <textarea className={`${styles.formTextarea} ${styles.disabledInput}`} value={patient.treatment || '-'} readOnly rows="2"></textarea>
          </div>
        </div>
      </div>

      {/* Vital Signs */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Vital Signs</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Height</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.height || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Weight</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.weight || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Blood Pressure</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.blood_pressure || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Pulse Rate</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.pulse_rate || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Respiratory Rate</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.respiratory_rate || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Temperature</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.temperature || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* Emergency Contact - Common to both */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Emergency Contact</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.emergency_contact_name || '-'} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone</label>
            <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.emergency_contact_phone || '-'} readOnly />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={styles.modalContent} style={{ maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <div className={styles.patientForm}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>
                {isOutpatient ? 'Outpatient Overview' : 'Inpatient Overview'}
              </h1>
              <div className={styles.patientStatus} style={{
                backgroundColor: patient.status === 'Admitted' ? '#10b981' : 
                                 patient.status === 'Discharged' ? '#6366f1' : '#f59e0b',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {patient.status}
              </div>
            </div>
          </div>

          {/* Conditionally render views based on patient type */}
          {isOutpatient ? renderOutpatientView() : renderInpatientView()}

          {/* Common sections */}
          {/* Emergency Contact */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Emergency Contact</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.emergency_contact_name || '-'} readOnly />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone</label>
                <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.emergency_contact_phone || '-'} readOnly />
              </div>
            </div>
          </div>

          {/* Medical Result */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Disposition & Result</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Disposition</label>
                <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.disposition || '-'} readOnly />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Result</label>
                <input className={`${styles.formInput} ${styles.disabledInput}`} value={patient.result || '-'} readOnly />
              </div>
            </div>
          </div>
          
          {/* Medical History Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Medical History</h2>
            <div className={styles.formActions} style={{ padding: '10px 0', margin: '10px 0' }}>
              <button 
                className={styles.submitButton}
                onClick={() => navigate(`/patients/history/${patient.id}`)}
              >
                View Complete Medical History
              </button>
            </div>
          </div>
          
          {/* Bottom buttons */}
          <div className={styles.formActions}>
            <button 
              className={styles.cancelButton}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOverview;
