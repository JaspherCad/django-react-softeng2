import React, { useState, useEffect } from "react";
import styles from "./AddPatient.module.css";

const AddOutpatient = () => {
  const [formData, setFormData] = useState({
    has_philhealth: false,
    case_number: "",
    hospital_case_number: "",
    hmo: "",

    // Patient Details
    name: "",
    ward_service: "",
    bed_number: "",
    address: "",
    phone: "",
    date_of_birth: "",
    birth_place: "",
    age: "",
    nationality: "",
    religion: "",
    occupation: "",
    gender: "",
    civil_status: "",
    medical_history: "",

    // Family Information
    father_name: "",
    father_address: "",
    father_contact: "",
    mother_name: "",
    mother_address: "",
    mother_contact: "",
    spouse_name: "",
    spouse_address: "",
    spouse_contact: "",

    // Admission Information
    status: "Admitted",
    type_of_admission: "",
    admission_date: "",
    admission_time: "",
    discharge_date: "",
    discharge_time: "",
    total_days: "",
    attending_physician: "",
    visit_type: "New",
    consultation_datetime: "",
    next_consultation_date: "",
    referred_by: "",

    // Emergency Contact
    emergency_contact_name: "",
    emergency_contact_phone: "",

    // Medical Information
    current_condition: "",
    notes: "",
    diagnosed_by: "",
    height: "",
    weight: "",
    blood_pressure: "",
    pulse_rate: "",
    respiratory_rate: "",
    temperature: "",
    physical_examination: "",
    main_complaint: "",
    present_illness: "",
    clinical_findings: "",
    icd_code: "",
    diagnosis: "",
    treatment: "",

    // Additional Fields (if needed)
    membership: "",
    principal_diagnosis: "",
    other_diagnosis: "",
    principal_operation: "",
    other_operation: "",
    disposition: "",
    result: "",
  });

  const [selectedFiles, setSelectedFiles] = useState(null);

  // Calculate total days when admission and discharge dates change
  useEffect(() => {
    if (formData.admissionDate && formData.dischargeDate) {
      const admission = new Date(formData.admissionDate);
      const discharge = new Date(formData.dischargeDate);
      const diffTime = Math.abs(discharge - admission);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({ ...prev, totalDays: diffDays.toString() }));
    }
  }, [formData.admissionDate, formData.dischargeDate]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        console.log("Uploading file:", file.name);
        // Example: Upload using FormData
        // const formData = new FormData();
        // formData.append('file', file);
        // Send formData to backend using fetch or axios
      });
    } else {
      console.log("No files selected.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields = [
      "caseNumber",
      "hospitalCaseNumber",
      "philHealth",
      "lastName",
      "givenName",
      "patientAddress",
      "patientContactNumber",
      "age",
      "gender",
      "civilStatus",
      "admissionDate",
      "admissionTime",
      "attendingPhysician",
      "typeOfAdmission",
      "admissionDiagnosis",
      "roomNumber",
      "visitStatus",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    console.log("Form submitted:", formData);
    alert("Patient record added successfully!");
  };

  return (
    <div className={styles.mainContent}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Add New Outpatient Record</h1>
          <div className={styles.headerActions}>
            <div className={styles.hospitalLogo}>
              <img
                src="./hospital_logo.png"
                alt="Antipolo Centro De Medikal Hospital Logo"
                className={styles.logoImage}
              />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.patientForm}>
          {/* Case Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Case Information</h3>

            {/* -- Case Number, Hospital Case Number, HMO*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Case Number</label>
                <input
                  type="text"
                  name="caseNumber"
                  value={formData.caseNumber}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hospital Case Number</label>
                <input
                  type="text"
                  name="hospitalCaseNumber"
                  value={formData.hospitalCaseNumber}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>HMO</label>
                <input
                  type="text"
                  name="hmo"
                  value={formData.hmo}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- PhilHealth */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>PhilHealth</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="philHealth"
                    value="with"
                    checked={formData.philHealth === "with"}
                    onChange={handleInputChange}
                    required
                  />
                  With
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="philHealth"
                    value="without"
                    checked={formData.philHealth === "without"}
                    onChange={handleInputChange}
                    required
                  />
                  Without
                </label>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Patient Details</h3>

            {/* -- Patient Name */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Middle Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- Patient Adress & Contact Number*/}
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Patient Address</label>
                <textarea
                  name="patientAddress"
                  value={formData.patientAddress}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
              {/* -- Contact Number */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Contact Number</label>
                <input
                  type="tel"
                  name="patientContactNumber"
                  value={formData.patientContactNumber}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {/* -- Birth date, Birth place, age*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {/* -- Nationality, Religion, Occupation*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- Gender */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Gender</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    required
                  />
                  Male
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                    required
                  />
                  Female
                </label>
              </div>
            </div>

            {/* -- Civil Status */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Civil Status</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civilStatus"
                    value="single"
                    checked={formData.civilStatus === "single"}
                    onChange={handleInputChange}
                  />
                  Single
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civilStatus"
                    value="married"
                    checked={formData.civilStatus === "married"}
                    onChange={handleInputChange}
                  />
                  Married
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civilStatus"
                    value="widow"
                    checked={formData.civilStatus === "widow"}
                    onChange={handleInputChange}
                  />
                  Widow
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civilStatus"
                    value="divorced"
                    checked={formData.civilStatus === "divorced"}
                    onChange={handleInputChange}
                  />
                  Divorced
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civilStatus"
                    value="separated"
                    checked={formData.civilStatus === "separated"}
                    onChange={handleInputChange}
                  />
                  Separated
                </label>
              </div>
            </div>

            {/* -- Medical History */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="3"
              />
            </div>
          </div>

          {/* Admission Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Consultation Information</h3>

            {/* -- Visit Type */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Visit Type</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="visitType"
                    value="new"
                    checked={formData.visitType === "new"}
                    onChange={handleInputChange}
                    required
                  />
                  New
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="visitType"
                    value="followUp"
                    checked={formData.visitType === "followUp"}
                    onChange={handleInputChange}
                    required
                  />
                  Follow-Up
                </label>
              </div>
            </div>

            {/* -- Consultation date & time */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Consultation Date</label>
                <input
                  type="date"
                  name="consultationDate"
                  value={formData.consultationDate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Consultation Time</label>
                <input
                  type="time"
                  name="consultationTime"
                  value={formData.consultationTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {/* -- Next Consultation date */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Next Consultation</label>
                <input
                  type="date"
                  name="nextConsultationDate"
                  value={formData.nextConsultationDate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- Attending Physician */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Attending Physician</label>
                <input
                  type="text"
                  name="attendingPhysician"
                  value={formData.attendingPhysician}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {/* -- Referred by (Physician/Agency) */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Referred by (Physician/Agency)
              </label>
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Medical Information</h3>

            {/* -- Height, weight, BP, PR, RR, Temp*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Height</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Blood Pressure</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pulse Rate</label>
                <input
                  type="text"
                  name="pulseRate"
                  value={formData.pulseRate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Respiratory Rate</label>
                <input
                  type="text"
                  name="respiratoryRate"
                  value={formData.respiratoryRate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Temperature</label>
                <input
                  type="text"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* Physical Examination */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Physical Examination</label>
                <textarea
                  name="physicalExamination"
                  value={formData.physicalExamination}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Main Complaint */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Main Complaint</label>
                <textarea
                  name="mainComplaint"
                  value={formData.mainCompliment}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Present Illness */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Present Illness</label>
                <textarea
                  name="presentIllness"
                  value={formData.presentIllness}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Clinical Findings */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Clinical Findings</h3>

            {/* ICD Code */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ICD Code</label>
                <input
                  type="text"
                  name="icdCodeNumber"
                  value={formData.icdCodeNumber}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* Diagnosis */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Diagnosis</label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Treatment */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Treatment</label>
                <textarea
                  name="presentIllness"
                  value={formData.presentIllness}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Other */}
            <label className={styles.formLabel}>Others</label>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Add Patient Record
            </button>
            <button type="button" className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOutpatient;
