/*
 * ClinicalReviewForm Component - Hospital Management System Phase 2
 * 
 * PHASE 2: CLINICAL DOCUMENTATION
 * - For Doctor/Nurse roles only
 * - Reviews pending patients from Reception Check-In
 * - Fills clinical data to move patient from "Pending" → "Ready_for_Coding"
 * 
 * Workflow:
 * 1. Doctor reviews patient demographics from Phase 1
 * 2. Enters clinical data (vitals, diagnosis, ICD code)
 * 3. Assigns attending physician
 * 4. Confirms intended admission type or changes it
 * 5. Submits to move patient to "Ready_for_Coding" status
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './ClinicalReviewForm.module.css';
import SearchBar from '../AngAtingSeachBarWIthDropDown';
import { 
  SearchHospitalUserApi, 
  patientDetailsAPI, 
  updateClinicalDataAPI, 
  confirmInpatientAPI, 
  confirmOutpatientAPI,
  getICDMappingsAPI 
} from '../../api/axios';

const ClinicalReviewForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Only allow Doctor/Nurse/Admin roles
  const allowedRoles = ['Doctor', 'Nurse', 'Admin'];
  if (!allowedRoles.includes(user?.role)) {
    return (
      <div className={styles.accessDenied}>
        <h2>Access Denied</h2>
        <p>Only clinical staff (Doctor/Nurse/Admin) can access clinical review.</p>
      </div>
    );
  }

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [clinicalDataSaved, setClinicalDataSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [icdMappings, setIcdMappings] = useState([]);
  const [selectedICDMapping, setSelectedICDMapping] = useState(null);

  // Clinical data form state
  const [clinicalData, setClinicalData] = useState({
    // Clinical Assessment
    attending_physician: "", // ID for submission
    attending_physician_name: "", // Name for display
    icd_code: "",
    principal_diagnosis: "",
    treatment: "",
    
    // Vitals
    blood_pressure: "",
    temperature: "",
    weight: "",
    height: "",
    pulse_rate: "",
    respiratory_rate: "",
    
    // Clinical Details
    main_complaint: "",
    present_illness: "",
    physical_examination: "",
    clinical_findings: "",
    
    // Admission Type Decision (separate from clinical data)
    final_admission_type: "", // Doctor's decision based on clinical assessment
  });

  // Check if clinical data has been saved
  useEffect(() => {
    if (patient) {
      // Check if essential clinical data exists to determine if Step 1 is complete
      const hasEssentialClinicalData = patient.main_complaint && 
                                      patient.physical_examination;
      setClinicalDataSaved(hasEssentialClinicalData);
    }
  }, [patient]);

  // Load patient data on component mount
  useEffect(() => {
    fetchPatientData();
    fetchICDMappings();
  }, [patientId]);

  const fetchICDMappings = async () => {
    try {
      const response = await getICDMappingsAPI();
      console.log(response)
      setIcdMappings(response.data);
    } catch (error) {
      console.error('Error fetching ICD mappings:', error);
    }
  };

  const fetchPatientData = async () => {
    try {
      const response = await patientDetailsAPI(patientId);
      const patientData = response.data;
      // Fix: define attendingName before using
      let attendingName = "";
      if (patientData.attending_physician) {
        attendingName = `${patientData.attending_physician.first_name || ''} ${patientData.attending_physician.last_name || ''}`.trim();
      }
      setPatient(patientData);
      setClinicalData(prev => ({
        ...prev,
        attending_physician: patientData.attending_physician?.id || "",
        attending_physician_name: attendingName,
        icd_code: patientData.icd_code || "",
        principal_diagnosis: patientData.principal_diagnosis || "",
        treatment: patientData.treatment || "",
        blood_pressure: patientData.blood_pressure || "",
        temperature: patientData.temperature || "",
        weight: patientData.weight || "",
        height: patientData.height || "",
        pulse_rate: patientData.pulse_rate || "",
        respiratory_rate: patientData.respiratory_rate || "",
        main_complaint: patientData.main_complaint || "",
        present_illness: patientData.present_illness || "",
        physical_examination: patientData.physical_examination || "",
        clinical_findings: patientData.clinical_findings || "",
        final_admission_type: patientData.intended_admission_type || "Undecided",
      }));
      setSearchTerm(attendingName); // for SearchBar display
    } catch (error) {
      console.error('Error fetching patient:', error);
      setErrors({ general: 'Failed to load patient data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicalData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleICDCodeChange = (e) => {
    const selectedICDCode = e.target.value;
    
    // Find the selected mapping
    const mapping = icdMappings.find(m => m.icd_code === selectedICDCode);
    setSelectedICDMapping(mapping);
    
    // Update clinical data
    setClinicalData(prev => ({
      ...prev,
      icd_code: selectedICDCode,
      // Clear attending physician when ICD code changes
      attending_physician: "",
      attending_physician_name: ""
    }));
    
    // Clear search term to reset physician search
    setSearchTerm("");
    
    // Clear specific error when user makes selection
    if (errors.icd_code) {
      setErrors(prev => ({ ...prev, icd_code: null }));
    }
  };

  const handlePhysicianSelect = (physician) => {
    console.log('👨‍⚕️ Physician selected:', physician);
    console.log('💾 Setting clinical data...');
    
    setClinicalData(prev => ({
      ...prev,
      attending_physician: physician.id,
      attending_physician_name: `${physician.first_name} ${physician.last_name}`.trim(),
    }));
    setSearchTerm(`${physician.first_name} ${physician.last_name}`.trim());
    setIsDropdownVisible(false);
    
    console.log('✅ Physician selection complete');
  };

  const validateClinicalData = () => {
    const newErrors = {};
    
    if (!clinicalData.main_complaint) {
      newErrors.main_complaint = "Main complaint is required";
    }
    
    if (!clinicalData.physical_examination) {
      newErrors.physical_examination = "Physical examination is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdmissionType = () => {
    const newErrors = {};
    
    if (!clinicalData.attending_physician) {
      newErrors.attending_physician = "Attending physician is required";
    }
    
    if (!clinicalData.icd_code) {
      newErrors.icd_code = "ICD code is required";
    }
    
    if (!clinicalData.principal_diagnosis) {
      newErrors.principal_diagnosis = "Principal diagnosis is required";
    }
    
    if (!clinicalData.final_admission_type) {
      newErrors.final_admission_type = "Final admission type decision is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 1: Save Clinical Data (status remains "Pending")
  const handleSaveClinicalData = async (e) => {
    e.preventDefault();
    
    if (!validateClinicalData()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Extract only clinical data (no admission type decision)
      const clinicalDataOnly = {
        treatment: clinicalData.treatment,
        blood_pressure: clinicalData.blood_pressure,
        temperature: clinicalData.temperature,
        weight: clinicalData.weight,
        height: clinicalData.height,
        pulse_rate: clinicalData.pulse_rate,
        respiratory_rate: clinicalData.respiratory_rate,
        main_complaint: clinicalData.main_complaint,
        present_illness: clinicalData.present_illness,
        physical_examination: clinicalData.physical_examination,
        clinical_findings: clinicalData.clinical_findings,
      };

      await updateClinicalDataAPI(patientId, clinicalDataOnly);
      
      // Refresh patient data to check if clinical data was saved
      await fetchPatientData();
      
      alert('Clinical data saved successfully! Patient status remains "Pending". You can now confirm the admission type.');
      
    } catch (error) {
      console.error('Error saving clinical data:', error);
      
      if (error.response?.status === 400) {
        setErrors({ general: 'Invalid clinical data provided. Please check your inputs and try again.' });
      } else if (error.response?.status === 404) {
        setErrors({ general: 'Patient not found.' });
      } else if (error.response?.status === 403) {
        setErrors({ general: 'You do not have permission to update clinical data.' });
      } else {
        setErrors({ general: 'Failed to save clinical data. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: Confirm Admission Type (status changes to "Ready_for_Coding")
  const handleConfirmAdmissionType = async (e) => {
    e.preventDefault();
    
    if (!validateAdmissionType()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const confirmData = {
        attending_physician: clinicalData.attending_physician,
        icd_code: clinicalData.icd_code,
        principal_diagnosis: clinicalData.principal_diagnosis,
      };

      if (clinicalData.final_admission_type === 'Inpatient') {
        await confirmInpatientAPI(patientId, confirmData);
      } else {
        await confirmOutpatientAPI(patientId, confirmData);
      }

      alert('Admission type confirmed successfully! Patient status updated to "Ready for Coding".');
      navigate('/patients/pending'); // Navigate to pending patients list
      
    } catch (error) {
      console.error('Error confirming admission type:', error);
      
      if (error.response?.status === 400) {
        setErrors({ general: 'Invalid admission type data. Please try again.' });
      } else if (error.response?.status === 404) {
        setErrors({ general: 'Patient not found.' });
      } else if (error.response?.status === 403) {
        setErrors({ general: 'You do not have permission to confirm admission type.' });
      } else {
        setErrors({ general: 'Failed to confirm admission type. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading patient data...</div>;
  }

  if (!patient) {
    return <div className={styles.error}>Patient not found</div>;
  }

  // Only show for pending patients
  if (patient.status !== 'Pending') {
    return (
      <div className={styles.statusError}>
        <h2>Patient Not Available for Clinical Review</h2>
        <p>Patient status: {patient.status}</p>
        <p>Clinical review is only available for patients with "Pending" status.</p>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Clinical Review - Phase 2</h1>
          <div className={styles.patientInfo}>
            <span className={styles.patientName}>{patient.name}</span>
            <span className={styles.caseNumber}>Case: {patient.case_number}</span>
            <span className={styles.status}>Status: {patient.status}</span>
          </div>
        </div>
      </header>

      <div className={styles.formContainer}>
        <form className={styles.clinicalForm}>
          
          {/* Progress Indicator */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressStep}>
              <div className={`${styles.stepNumber} ${styles.active}`}>1</div>
              <span className={styles.stepLabel}>Clinical Data Entry</span>
            </div>
            <div className={styles.progressLine}></div>
            <div className={styles.progressStep}>
              <div className={`${styles.stepNumber} ${clinicalDataSaved ? styles.active : ''}`}>2</div>
              <span className={styles.stepLabel}>Admission Type Confirmation</span>
            </div>
          </div>

          {/* Step 1: Clinical Data Entry */}
          <div className={styles.stepContainer}>
            <h3 className={styles.sectionTitle}>
              Step 1: Clinical Data Entry
              {clinicalDataSaved && <span className={styles.completedBadge}>✓ Completed</span>}
            </h3>
          
            {/* Patient Demographics (Read-only) */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Patient Information (From Check-In)</h3>
            <div className={styles.readOnlyGrid}>
              <div className={styles.readOnlyField}>
                <label>Name:</label>
                <span>{patient.name}</span>
              </div>
              <div className={styles.readOnlyField}>
                <label>Date of Birth:</label>
                <span>{patient.date_of_birth}</span>
              </div>
              <div className={styles.readOnlyField}>
                <label>Gender:</label>
                <span>{patient.gender}</span>
              </div>
              <div className={styles.readOnlyField}>
                <label>Patient Intent:</label>
                <span className={styles.patientIntent}>
                  {patient.intended_admission_type || 'Not specified'}
                </span>
              </div>
            </div>
          </div>



          {/* Vital Signs */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Vital Signs</h3>
            <div className={styles.vitalsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Blood Pressure</label>
                <input
                  type="text"
                  name="blood_pressure"
                  value={clinicalData.blood_pressure}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., 120/80"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={clinicalData.temperature}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  step="0.1"
                  placeholder="e.g., 36.5"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={clinicalData.weight}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  step="0.1"
                  placeholder="e.g., 70.5"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={clinicalData.height}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  step="0.1"
                  placeholder="e.g., 175.0"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pulse Rate (bpm)</label>
                <input
                  type="number"
                  name="pulse_rate"
                  value={clinicalData.pulse_rate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., 72"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Respiratory Rate (rpm)</label>
                <input
                  type="number"
                  name="respiratory_rate"
                  value={clinicalData.respiratory_rate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., 16"
                />
              </div>
            </div>
          </div>

          {/* Clinical Details */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Clinical Details</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Main Complaint <span className={styles.required}>*</span>
              </label>
              <textarea
                name="main_complaint"
                value={clinicalData.main_complaint}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="3"
                placeholder="Patient's primary complaint or reason for visit..."
              />
              {errors.main_complaint && (
                <span className={styles.errorText}>{errors.main_complaint}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Present Illness</label>
              <textarea
                name="present_illness"
                value={clinicalData.present_illness}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="3"
                placeholder="History of present illness..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Physical Examination <span className={styles.required}>*</span>
              </label>
              <textarea
                name="physical_examination"
                value={clinicalData.physical_examination}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="4"
                placeholder="Physical examination findings..."
              />
              {errors.physical_examination && (
                <span className={styles.errorText}>{errors.physical_examination}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Clinical Findings</label>
              <textarea
                name="clinical_findings"
                value={clinicalData.clinical_findings}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="3"
                placeholder="Additional clinical findings..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Treatment Plan</label>
              <textarea
                name="treatment"
                value={clinicalData.treatment}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="3"
                placeholder="Treatment plan and orders..."
              />
            </div>
          </div>
          {/* End of Step 1: Clinical Data Entry */}
          </div>

          {/* Step 1: Clinical Data Entry Actions */}
          <div className={styles.formSection}>
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={`${styles.submitButton} ${clinicalDataSaved ? styles.savedButton : ''}`}
                onClick={handleSaveClinicalData}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : clinicalDataSaved ? 'Update Clinical Data' : 'Save Clinical Data'}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => navigate('/patients/pending')}
              >
                Cancel
              </button>
            </div>
            
            {/* Step 2 Unlock Indicator */}
            {clinicalDataSaved && (
              <div className={styles.stepUnlockIndicator}>
                <p className={styles.unlockMessage}>
                  ✅ <strong>Step 1 Complete!</strong> You can now proceed to Step 2: Admission Type Confirmation below.
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Admission Type Confirmation */}
          {clinicalDataSaved && (
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                Step 2: Admission Type Confirmation
              </h3>
              
              {/* Clinical Assessment */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Clinical Assessment</h3>
                
                {/* ICD Code Dropdown - Select First */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    ICD Code <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="icd_code"
                    value={clinicalData.icd_code}
                    onChange={handleICDCodeChange}
                    className={styles.formInput}
                  >
                    <option value="">Select ICD Code...</option>
                    {icdMappings.map((mapping) => (
                      <option key={mapping.id} value={mapping.icd_code}>
                        {mapping.icd_code} - {mapping.description || mapping.department.name + ' Condition'} (Dept: {mapping.department.name})
                      </option>
                    ))}
                  </select>
                  {errors.icd_code && (
                    <span className={styles.errorText}>{errors.icd_code}</span>
                  )}
                  {selectedICDMapping && (
                    <div className={styles.mappingInfo}>
                      <small>
                        📍 This ICD code maps to: <strong>{selectedICDMapping.department.name}</strong> Department
                      </small>
                    </div>
                  )}
                </div>

                {/* Attending Physician - Filtered by ICD Code */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Attending Physician <span className={styles.required}>*</span>
                  </label>
                  {!clinicalData.icd_code ? (
                    <div className={styles.disabledField}>
                      <input
                        type="text"
                        placeholder="Please select an ICD code first to filter doctors by department"
                        className={`${styles.formInput} ${styles.disabled}`}
                        disabled
                      />
                      <small className={styles.helpText}>
                        👆 Select an ICD code above to see doctors from the appropriate department
                      </small>
                    </div>
                  ) : (
                    <>
                      <SearchBar
                        placeholder={`Search doctors in ${selectedICDMapping?.department.name || 'selected'} department...`}
                        searchApi={async (searchTerm) => {
                          try {
                            console.log('🔍 SearchBar API called with term:', searchTerm);
                            console.log('📋 ICD code:', clinicalData.icd_code);
                            
                            const response = await SearchHospitalUserApi(searchTerm, { icd_code: clinicalData.icd_code });
                            console.log('📡 API response:', response);
                            
                            // The backend returns: { users: [...], filters_applied: {...}, total_results: 5 }
                            // The SearchBar expects: { data: [...] }
                            const users = response.data?.users || [];
                            console.log('👥 Users from API:', users);
                            
                            // Return in the format SearchBar expects
                            return {
                              data: users
                            };
                          } catch (error) {
                            console.error('❌ Error in SearchBar API call:', error);
                            return { data: [] };
                          }
                        }}
                        onSelectSuggestion={handlePhysicianSelect}
                        suggestedOutput={['first_name', 'user_id','last_name', 'role', 'department']}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        isDropdownVisible={isDropdownVisible}
                        setIsDropdownVisible={setIsDropdownVisible}
                        isIDIncludedInResultSuggestion={false}
                      />
                      <small className={styles.helpText}>
                        🔍 Showing only doctors from <strong>{selectedICDMapping?.department.name}</strong> department
                      </small>
                    </>
                  )}
                  {errors.attending_physician && (
                    <span className={styles.errorText}>{errors.attending_physician}</span>
                  )}
                </div>

                {/* Principal Diagnosis */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Principal Diagnosis <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    name="principal_diagnosis"
                    value={clinicalData.principal_diagnosis}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows="3"
                    placeholder="Enter the primary diagnosis..."
                  />
                  {errors.principal_diagnosis && (
                    <span className={styles.errorText}>{errors.principal_diagnosis}</span>
                  )}
                </div>
              </div>
              
              {/* Clinical Data Summary for Reference */}
              <div className={styles.clinicalSummarySection}>
                <h4 className={styles.summaryTitle}>📋 Clinical Data Summary (For Reference)</h4>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <label>Main Complaint:</label>
                    <span>{patient.main_complaint || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Physical Examination:</label>
                    <span>{patient.physical_examination || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Present Illness:</label>
                    <span>{patient.present_illness || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Clinical Findings:</label>
                    <span>{patient.clinical_findings || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Treatment Plan:</label>
                    <span>{patient.treatment || 'Not specified'}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Vitals:</label>
                    <span>
                      {patient.blood_pressure && `BP: ${patient.blood_pressure}`}
                      {patient.temperature && `, Temp: ${patient.temperature}°C`}
                      {patient.pulse_rate && `, Pulse: ${patient.pulse_rate} bpm`}
                      {(!patient.blood_pressure && !patient.temperature && !patient.pulse_rate) && 'Not recorded'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.patientIntentDisplay}>
                <p><strong>Patient's Original Intent:</strong> {patient.intended_admission_type || 'Not specified'}</p>
                <p className={styles.instructionText}>
                  Based on your clinical assessment above, confirm the final admission type:
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Clinical Decision <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="final_admission_type"
                      value="Inpatient"
                      checked={clinicalData.final_admission_type === "Inpatient"}
                      onChange={handleInputChange}
                    />
                    <strong>Inpatient</strong> (Requires hospitalization)
                    <small className={styles.radioDescription}>
                      Patient needs overnight stay, continuous monitoring, or complex procedures
                    </small>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="final_admission_type"
                      value="Outpatient"
                      checked={clinicalData.final_admission_type === "Outpatient"}
                      onChange={handleInputChange}
                    />
                    <strong>Outpatient</strong> (Same-day care)
                    <small className={styles.radioDescription}>
                      Patient can be treated and discharged on the same day
                    </small>
                  </label>
                </div>
                {errors.final_admission_type && (
                  <span className={styles.errorText}>{errors.final_admission_type}</span>
                )}
              </div>

              <div className={styles.confirmationNote}>
                <p><strong>Note:</strong> Once confirmed, the patient status will change from "Pending" to "Ready for Coding" and will be forwarded to the billing department for Phase 3 (Coding & Billing).</p>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.confirmButton}
                  onClick={handleConfirmAdmissionType}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming...' : '✅ Confirm Admission Type & Complete Review'}
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.general && (
            <div className={styles.generalError}>
              {errors.general}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClinicalReviewForm;
