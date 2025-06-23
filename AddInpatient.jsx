import React, { useState, useEffect } from "react";
import styles from "./AddPatient.module.css";

const AddInpatient = () => {
  const [formData, setFormData] = useState({
    // Case Information
    caseNumber: "",
    hospitalCaseNumber: "",
    hmo: "",
    philHealth: "",

    // Patient Details
    lastName: "",
    givenName: "",
    middleName: "",
    wardService: "",
    bedNumber: "",
    patientAddress: "",
    patientContactNumber: "",
    birthDate: "",
    birthPlace: "",
    age: "",
    nationality: "",
    religion: "",
    occupation: "",
    gender: "",
    civilStatus: "",
    medicalHistory: "",

    // Family Information
    fatherName: "",
    fatherAddress: "",
    fatherContactNumber: "",
    motherName: "",
    motherAddress: "",
    motherContactNumber: "",
    spouseName: "",
    spouseAddress: "",
    spouseContactNumber: "",

    // Admission Information
    visitStatus: "",
    admissionDate: "",
    admissionTime: "",
    dischargeDate: "",
    dischargeTime: "",
    totalDays: "",
    attendingPhysician: "",
    typeOfAdmission: "",
    referredBy: "",

    // Medical Information
    admissionDiagnosis: "",
    membership: "",
    principalDiagnosis: "",
    otherDiagnosis: "",
    icdCodeNumber: "",
    principalOperation: "",
    otherOperation: "",
    disposition: "",
    result: "",
    physicianSignature: "",
  });

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
      "bedNumber",
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
          <h1 className={styles.pageTitle}>Add New Inpatient Record</h1>
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
                <label className={styles.formLabel}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Given Name</label>
                <input
                  type="text"
                  name="givenName"
                  value={formData.givenName}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- Ward/Service & Bed Number */}
            <div className={styles.formGrid}>
              <div className={styles.checkboxGroup}>
                <label className={styles.formLabel}>Ward/Service</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="wardService"
                      value="private"
                      checked={formData.wardService === "private"}
                      onChange={handleInputChange}
                      required
                    />
                    Private Case
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="wardService"
                      value="house"
                      checked={formData.wardService === "house"}
                      onChange={handleInputChange}
                      required
                    />
                    House Case
                  </label>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bed Number</label>
                <input
                  type="text"
                  name="bedNumber"
                  value={formData.bedNumber}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
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
                <label className={styles.formLabel}>Birth Place</label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
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

            {/* -- Natioinality, Religion, Occupation*/}
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

          {/* Family Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Family Information</h3>

            {/* -- Father's Information */}
            <div className={styles.familySubsection}>
              <h4 className={styles.subsectionTitle}>Father's Information</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Father's Address</label>
                  <input
                    type="text"
                    name="fatherAddress"
                    value={formData.fatherAddress}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Father's Contact Number
                  </label>
                  <input
                    type="tel"
                    name="fatherContactNumber"
                    value={formData.fatherContactNumber}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* -- Mother's Information */}
            <div className={styles.familySubsection}>
              <h4 className={styles.subsectionTitle}>Mother's Information</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mother's Address</label>
                  <input
                    type="text"
                    name="motherAddress"
                    value={formData.motherAddress}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Mother's Contact Number
                  </label>
                  <input
                    type="tel"
                    name="motherContactNumber"
                    value={formData.motherContactNumber}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* -- Spouse Information */}
            <div className={styles.familySubsection}>
              <h4 className={styles.subsectionTitle}>Spouse's Information</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Spouse's Name</label>
                  <input
                    type="text"
                    name="spouseName"
                    value={formData.spouseName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Spouse's Address</label>
                  <input
                    type="text"
                    name="spouseAddress"
                    value={formData.spouseAddress}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Spouse's Contact Number
                  </label>
                  <input
                    type="tel"
                    name="spouseContactNumber"
                    value={formData.spouseContactNumber}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admission Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Admission Information</h3>

            {/* -- Visit Status */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Visit Status</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="visitStatus"
                    value="admitted"
                    checked={formData.visitStatus === "admitted"}
                    onChange={handleInputChange}
                    required
                  />
                  Admitted
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="visitStatus"
                    value="discharged"
                    checked={formData.visitStatus === "discharged"}
                    onChange={handleInputChange}
                    required
                  />
                  Discharged
                </label>
              </div>
            </div>

            {/* -- Admission date & time, Discharge date & time, Total number of days */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admission Time</label>
                <input
                  type="time"
                  name="admissionTime"
                  value={formData.admissionTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {/* -- Discharge date & time, Total number of days */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Discharge Date</label>
                <input
                  type="date"
                  name="dischargeDate"
                  value={formData.dischargeDate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Discharge Time</label>
                <input
                  type="time"
                  name="dischargeTime"
                  value={formData.dischargeTime}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Total Days</label>
                <input
                  type="text"
                  name="totalDays"
                  value={formData.totalDays}
                  className={styles.formInput}
                  readOnly
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

            {/* -- Type of admission */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Type of Admission</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="typeOfAdmission"
                    value="new"
                    checked={formData.typeOfAdmission === "new"}
                    onChange={handleInputChange}
                    required
                  />
                  New
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="typeOfAdmission"
                    value="old"
                    checked={formData.typeOfAdmission === "old"}
                    onChange={handleInputChange}
                    required
                  />
                  Old/Former
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="typeOfAdmission"
                    value="opd"
                    checked={formData.typeOfAdmission === "opd"}
                    onChange={handleInputChange}
                    required
                  />
                  OPD
                </label>
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

            {/* Admission Diagnosis */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admission Diagnosis</label>
                <textarea
                  name="admissionDiagnosis"
                  value={formData.admissionDiagnosis}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Membership */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Membership</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="membership"
                    value="sss"
                    checked={formData.membership === "sss"}
                    onChange={handleInputChange}
                  />
                  SSS
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="membership"
                    value="gsis"
                    checked={formData.membership === "gsis"}
                    onChange={handleInputChange}
                  />
                  GSIS
                </label>
              </div>
            </div>

            {/* Principal Diagnosis, Other Diagnosis */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Principal Diagnosis</label>
                <textarea
                  name="principalDiagnosis"
                  value={formData.principalDiagnosis}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Other Diagnosis</label>
                <textarea
                  name="otherDiagnosis"
                  value={formData.otherDiagnosis}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ICD Code Number</label>
                <input
                  type="text"
                  name="icdCodeNumber"
                  value={formData.icdCodeNumber}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Principal Operation/Procedure
                </label>
                <input
                  type="text"
                  name="principalOperation"
                  value={formData.principalOperation}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Other Operation/Procedure
                </label>
                <input
                  type="text"
                  name="otherOperation"
                  value={formData.otherOperation}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Disposition</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="discharged"
                    checked={formData.disposition === "discharged"}
                    onChange={handleInputChange}
                  />
                  Discharged
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="transferred"
                    checked={formData.disposition === "transferred"}
                    onChange={handleInputChange}
                  />
                  Transferred
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="hama"
                    checked={formData.disposition === "hama"}
                    onChange={handleInputChange}
                  />
                  HAMA
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="absconded"
                    checked={formData.disposition === "absconded"}
                    onChange={handleInputChange}
                  />
                  Absconded
                </label>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Result</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="recovered"
                    checked={formData.result === "recovered"}
                    onChange={handleInputChange}
                  />
                  Recovered
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="died"
                    checked={formData.result === "died"}
                    onChange={handleInputChange}
                  />
                  Died
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="minus48"
                    checked={formData.result === "minus48"}
                    onChange={handleInputChange}
                  />
                  (-) 48 Hours
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="plus48"
                    checked={formData.result === "plus48"}
                    onChange={handleInputChange}
                  />
                  (+) 48 Hours
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="improved"
                    checked={formData.result === "improved"}
                    onChange={handleInputChange}
                  />
                  Improved
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="unimproved"
                    checked={formData.result === "unimproved"}
                    onChange={handleInputChange}
                  />
                  Unimproved
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="autopsy"
                    checked={formData.result === "autopsy"}
                    onChange={handleInputChange}
                  />
                  Autopsy
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="noAutopsy"
                    checked={formData.result === "noAutopsy"}
                    onChange={handleInputChange}
                  />
                  No Autopsy
                </label>
              </div>
            </div>
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

export default AddInpatient;
