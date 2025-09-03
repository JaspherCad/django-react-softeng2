import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./PatientDataView.module.css";
import { getPatientImagesAPI } from '../../api/axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Get the API base URL from environment variables
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

//pseudocode:
//fetch the PatientHistory with the hitoryID of ${id} AND caseCode of this ${caseCode} and even historyUSer

//potentially that's a list so FETCH the latest one by ordering them in descending order based on creation time



const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const dt = new Date(dateStr);
  return dt.toLocaleDateString();
};

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return 'N/A';
  const dt = new Date(dateTimeStr);
  return dt.toLocaleString();
};

const calculateAge = (birthDateStr) => {
  if (!birthDateStr) return 'N/A';
  const birth = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const PatientDataView = ({ patientData }) => {
  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitStep, setAdmitStep] = useState(null);
  useEffect(() => {
    const fetchPatient = async () => {
      try {


        const imageResponse = await getPatientImagesAPI(patientData.id);
        setExistingImages(imageResponse.data || []);

      } catch (err) {
        console.error('Failed to load patient data.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientData]);

  // Admit modal handlers - same as PatientHistory
  const handleUpdateClick = () => {
    setShowAdmitModal(true);
  };

  const chooseFormType = (type) => {
    setAdmitStep(type);
    navigate(`/patients/${type}/edit/${patientData.id}`);
    setShowAdmitModal(false);
  };

  const closeAdmitModal = () => {
    setShowAdmitModal(false);
    setAdmitStep(null);
  };

  console.log(patientData)
  if (!patientData) return null;

  return (
    <div className={styles['patient-view']}>
      <h1>Viewing Patient #{patientData.case_number} ({patientData.history_id})</h1>
      <div className={styles['patient-section']}>
        {/* Header with tabs and edit button */}
        <div className={styles['section-header']}>
          <button className={styles['tab-button']}>Patient Data</button>
          <button 
            className={styles['edit-button']}
            onClick={handleUpdateClick}
          >
            ✎ Update
          </button>
        </div>

        {/* Case Information */}
        <div className={styles['info-section']}>
          <h2>Case Information</h2>
          <hr />
          <div className={styles['case-details']}>
            <div className={styles['detail-row']}>
              <span>Case Number:</span>
              <span>#{patientData.case_number}</span>
            </div>
            <div className={styles['detail-row']}>
              <span>Hospital Case Number:</span>
              <span>#{patientData.hospital_case_number}</span>
            </div>
            <div className={styles['detail-row']}>
              <span>PhilHealth:</span>
              <span>{patientData.has_philhealth ? 'With' : 'Without'}</span>
            </div>
            <div className={styles['detail-row']}>
              <span>HMO:</span>
              <span>{patientData.has_hmo ? patientData.hmo : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className={styles['info-section']}>
          <h2>Patient Details</h2>
          <hr />
          <div className={styles['patient-info']}>
            <div className={styles['profile-image']}>


              {/* <img src="https://example.com/default-user.png" alt="Patient" /> */}

              {/* Existing Images (Edit Mode Only) */}
              {existingImages.length > 0 && (
                <div
                  className={styles.firstImageContainer}
                  onClick={() => setModalOpen(true)}
                >
                  <img
                    src={
                      existingImages[0].file.startsWith('http')
                        ? existingImages[0].file
                        : `${API_BASE}:8000${existingImages[0].file}`
                    }
                    alt="Patient"
                    className={styles.firstImage}
                  />
                  <div className={styles.viewAllIconContainer}>
                    VIEWs
                  </div>
                </div>
              )}


            </div>
            <div className={styles['patient-data']}>
              {/* List of patient personal details */}
              {[
                ['Name', patientData.name],
                ['Contact Number', patientData.phone],
                ['Address', patientData.address],
                ['Civil Status', patientData.civil_status],
                ['Nationality', patientData.nationality],
                ['Religion', patientData.religion],
                ['Occupation', patientData.occupation],
                ['Date of Birth', formatDate(patientData.date_of_birth)],
                ['Age', calculateAge(patientData.date_of_birth)],
              ].map(([label, value]) => (
                <div key={label} className={styles['detail-row']}>
                  <span>{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admission Information */}
        <div className={styles['info-section']}>
          <h2>Admission Information</h2>
          <hr />
          <div className={styles['admission-info']}>
            {[
              ['Attending Physician', patientData.attending_physician ? `Dr. ${patientData.attending_physician}` : 'N/A'],
              ['Visit Status', patientData.status],
              ['Admission Date & Time', formatDateTime(patientData.admission_date)],
              ['Discharged Date & Time', formatDateTime(patientData.discharge_date)],
              ['Type of Admission', patientData.visit_type],
              ['Referred by (Physician/Agency)', patientData.referred_by || 'N/A'],
            ].map(([label, value]) => (
              <div key={label} className={styles['detail-row']}>
                <span>{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Information */}
        <div className={styles['info-section']}>
          <h2>Medical Information</h2>
          <hr />
          <div className={styles['medical-info']}>
            <div className={styles['diagnosis-section']}>
              <h3>Admission Diagnosis</h3>
              <p>{patientData.diagnosis || 'N/A'}</p>
            </div>
            <div className={styles['diagnosis-section']}>
              <h3>Principal Diagnosis</h3>
              <p>{patientData.icd_code || 'N/A'}</p>
            </div>
            <div className={styles['diagnosis-section']}>
              <h3>Treatment</h3>
              <p>{patientData.treatment || 'N/A'}</p>
            </div>
          </div>


          {/* Modal for all images */}
          {modalOpen && (
            <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button
                  className={styles.closeButton}
                  onClick={() => setModalOpen(false)}
                >
                  ×
                </button>
                <div className={styles.imageGrid}>
                  {existingImages.map(img => (
                    <img
                      key={img.id}
                      src={
                        img.file.startsWith('http')
                          ? img.file
                          : `${API_BASE}:8000${img.file}`
                      }
                      alt="Patient"
                      className={styles.gridImage}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Admit Modal - same as PatientHistory */}
        {showAdmitModal && (
          <div className={styles.modalOverlay} onClick={closeAdmitModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Select Form Type</h2>
                <button className={styles.closeButton} onClick={closeAdmitModal}>
                  &times;
                </button>
              </div>
              <div className={styles.modalContent}>
                <button
                  className={styles.btnOption}
                  onClick={() => chooseFormType('inpatient')}
                >
                  Inpatient
                </button>
                <button
                  className={styles.btnOption}
                  onClick={() => chooseFormType('outpatient')}
                >
                  Outpatient
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDataView;
