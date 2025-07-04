/*
 * CodingAndBedAssignment Component - Hospital Management System Phase 3
 * 
 * PHASE 3: CODING & BED ASSIGNMENT
 * - For Medical Coder/Biller roles only
 * - Reviews patients with "Ready_for_Coding" status from Phase 2
 * - Verifies ICD code and physician alignment
 * - Assigns beds for inpatients or finalizes outpatients
 * - Creates billing records and transitions patients to final status
 * 
 * Workflow:
 * 1. Medical Coder reviews "Ready_for_Coding" patients
 * 2. Verifies ICD code and attending physician match department
 * 3. For Inpatients: Assigns bed and creates billing with bed assignment
 * 4. For Outpatients: Creates billing without bed assignment
 * 5. Finalizes patient status to "Admitted" or "Outpatient"
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './CodingAndBedAssignment.module.css';
import { 
  getReadyForCodingPatientsAPI,
  finalizeInpatientAPI, 
  finalizeOutpatientAPI,
  getAvailableBedsAPI,
  getICDMappingsAPI 
} from '../../api/axios';

const CodingAndBedAssignment = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Only allow Admin/Teller (Medical Coder/Biller) roles
  const allowedRoles = ['Admin', 'Teller'];
  if (!allowedRoles.includes(user?.role)) {
    return (
      <div className={styles.accessDenied}>
        <h2>Access Denied</h2>
        <p>Only Medical Coders/Billers (Admin/Teller) can access coding and bed assignment.</p>
      </div>
    );
  }

  const [readyPatients, setReadyPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [icdMappings, setIcdMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Load initial data
  useEffect(() => {
    fetchReadyForCodingPatients();
    fetchAvailableBeds();
    fetchICDMappings();
  }, []);

  const fetchReadyForCodingPatients = async () => {
    try {
      const response = await getReadyForCodingPatientsAPI();
      setReadyPatients(response.data.results);
    } catch (error) {
      console.error('Error fetching ready patients:', error);
      setErrors({ general: 'Failed to load patients ready for coding' });
    }
  };

  const fetchAvailableBeds = async () => {
    try {
      const response = await getAvailableBedsAPI();
      console.log(response.data)
      setAvailableBeds(response.data);
    } catch (error) {
      console.error('Error fetching available beds:', error);
      setErrors({ general: 'Failed to load available beds' });
    } finally {
      setLoading(false);
    }
  };

  const fetchICDMappings = async () => {
    try {
      const response = await getICDMappingsAPI();
      setIcdMappings(response.data);
    } catch (error) {
      console.error('Error fetching ICD mappings:', error);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedBed(null);
    setErrors({});
  };

  const handleBedSelect = (bed) => {
    setSelectedBed(bed);
    setErrors({});
  };

  const validatePatientData = () => {
    const newErrors = {};
    
    if (!selectedPatient) {
      newErrors.patient = "Please select a patient";
      return newErrors;
    }

    if (!selectedPatient.icd_code) {
      newErrors.icd_code = "Patient must have an ICD code assigned";
    }

    if (!selectedPatient.attending_physician) {
      newErrors.attending_physician = "Patient must have an attending physician assigned";
    }

    if (!selectedPatient.principal_diagnosis) {
      newErrors.principal_diagnosis = "Patient must have a principal diagnosis";
    }

    // Verify ICD code and physician department alignment
    const icdMapping = icdMappings.find(m => m.icd_code === selectedPatient.icd_code);
    if (icdMapping && selectedPatient.attending_physician?.department?.id !== icdMapping.department.id) {
      newErrors.department_mismatch = "Attending physician's department does not match ICD code mapping";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleFinalizeInpatient = async () => {
    const validationErrors = validatePatientData();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!selectedBed) {
      setErrors({ bed: "Please select a bed for inpatient admission" });
      return;
    }

    setIsProcessing(true);
    
    try {
      const bedData = { bed_id: selectedBed.id };
      await finalizeInpatientAPI(selectedPatient.id, bedData);
      
      alert(`Patient ${selectedPatient.name} has been successfully admitted as Inpatient with bed assignment.`);
      
      // Refresh the patient list
      await fetchReadyForCodingPatients();
      await fetchAvailableBeds();
      setSelectedPatient(null);
      setSelectedBed(null);
      
    } catch (error) {
      console.error('Error finalizing inpatient:', error);
      
      if (error.response?.status === 400) {
        setErrors({ general: error.response.data.error || 'Invalid inpatient data' });
      } else {
        setErrors({ general: 'Failed to finalize inpatient admission' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizeOutpatient = async () => {
    const validationErrors = validatePatientData();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsProcessing(true);
    
    try {
      await finalizeOutpatientAPI(selectedPatient.id);
      
      alert(`Patient ${selectedPatient.name} has been successfully finalized as Outpatient.`);
      
      // Refresh the patient list
      await fetchReadyForCodingPatients();
      setSelectedPatient(null);
      setSelectedBed(null);
      
    } catch (error) {
      console.error('Error finalizing outpatient:', error);
      
      if (error.response?.status === 400) {
        setErrors({ general: error.response.data.error || 'Invalid outpatient data' });
      } else {
        setErrors({ general: 'Failed to finalize outpatient admission' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading patients ready for coding...</div>;
  }

  return (
    <div className={styles.mainContent}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Coding & Bed Assignment - Phase 3</h1>
          <p className={styles.subtitle}>Review patients ready for coding and finalize their admission</p>
        </div>
      </header>

      <div className={styles.contentContainer}>
        {/* Left Panel: Patient List */}
        <div className={styles.leftPanel}>
          <h2 className={styles.sectionTitle}>
            Patients Ready for Coding ({readyPatients.length})
          </h2>
          
          {readyPatients.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No patients ready for coding at this time.</p>
              <small>Patients will appear here after completing Phase 2 (Clinical Review).</small>
            </div>
          ) : (
            <div className={styles.patientList}>
              {readyPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`${styles.patientCard} ${selectedPatient?.id === patient.id ? styles.selected : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className={styles.patientHeader}>
                    <h3 className={styles.patientName}>{patient.name}</h3>
                    <span className={styles.caseNumber}>{patient.case_number}</span>
                  </div>
                  <div className={styles.patientDetails}>
                    <p><strong>DOB:</strong> {patient.date_of_birth}</p>
                    <p><strong>Intended Type:</strong> {patient.intended_admission_type || 'Not specified'}</p>
                    <p><strong>ICD Code:</strong> {patient.icd_code || 'Not assigned'}</p>
                    <p><strong>Attending Physician:</strong> {patient.attending_physician ? 
                      `${patient.attending_physician.first_name} ${patient.attending_physician.last_name}` : 'Not assigned'}</p>
                    <p><strong>Department:</strong> {patient.attending_physician?.department?.name || 'Not specified'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel: Patient Review & Actions */}
        <div className={styles.rightPanel}>
          {!selectedPatient ? (
            <div className={styles.selectPatientPrompt}>
              <h2>Select a Patient</h2>
              <p>Choose a patient from the list to review their information and finalize their admission.</p>
            </div>
          ) : (
            <div className={styles.reviewSection}>
              <h2 className={styles.sectionTitle}>
                Review Patient: {selectedPatient.name}
              </h2>

              {/* Patient Summary */}
              <div className={styles.patientSummary}>
                <h3>Clinical Summary</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <label>Case Number:</label>
                    <span>{selectedPatient.case_number}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Main Complaint:</label>
                    <span>{selectedPatient.main_complaint || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Principal Diagnosis:</label>
                    <span>{selectedPatient.principal_diagnosis || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>ICD Code:</label>
                    <span>{selectedPatient.icd_code || 'Not assigned'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Attending Physician:</label>
                    <span>{selectedPatient.attending_physician ? 
                      `${selectedPatient.attending_physician.first_name} ${selectedPatient.attending_physician.last_name}` : 'Not assigned'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Physician Department:</label>
                    <span>{selectedPatient.attending_physician?.department?.name || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Patient Intent:</label>
                    <span>{selectedPatient.intended_admission_type || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Validation Messages */}
              {Object.keys(errors).length > 0 && (
                <div className={styles.errorSection}>
                  {Object.entries(errors).map(([key, message]) => (
                    <div key={key} className={styles.errorMessage}>
                      ❌ {message}
                    </div>
                  ))}
                </div>
              )}

              {/* Bed Selection for Inpatients */}
              <div className={styles.bedSelection}>
                <h3>Bed Assignment (For Inpatients Only)</h3>
                <p>Select a bed if this patient will be admitted as an inpatient:</p>
                
                <div className={styles.bedGrid}>
                  {availableBeds.map((room) => (
                    <div key={room.id} className={styles.roomCard}>
                      <h4>{room.name}</h4>
                      <p className={styles.roomType}>{room.room_type}</p>
                      <p className={styles.hourlyRate}>₱{room.hourly_rate}/days</p>
                      
                      <div className={styles.bedList}>
                        {room.beds?.filter(bed => !bed.is_occupied).map((bed) => (
                          <button
                            key={bed.id}
                            className={`${styles.bedButton} ${selectedBed?.id === bed.id ? styles.selected : ''}`}
                            onClick={() => handleBedSelect(bed)}
                          >
                            Bed {bed.number}
                          </button>
                        ))}
                        {room.bed_set?.filter(bed => !bed.is_occupied).length === 0 && (
                          <p className={styles.noBedsAvailable}>No available beds</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedBed && (
                  <div className={styles.selectedBedInfo}>
                    <strong>Selected Bed:</strong> Bed {selectedBed.number} in {availableBeds.find(room => 
                      room.bed_set?.some(bed => bed.id === selectedBed.id))?.name}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  className={styles.inpatientButton}
                  onClick={handleFinalizeInpatient}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : '🏥 Finalize as Inpatient'}
                </button>

                <button
                  className={styles.outpatientButton}
                  onClick={handleFinalizeOutpatient}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : '🚶 Finalize as Outpatient'}
                </button>
              </div>

              <div className={styles.actionNote}>
                <p><strong>Note:</strong> Finalizing will create a billing record and set the patient's final status.</p>
                <ul>
                  <li><strong>Inpatient:</strong> Requires bed selection, creates billing with bed assignment</li>
                  <li><strong>Outpatient:</strong> No bed required, creates billing for same-day care</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingAndBedAssignment;
