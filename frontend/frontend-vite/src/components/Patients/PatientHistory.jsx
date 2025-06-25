import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchPatientHistoryAPI } from '../../api/axios';
import styles from './Patients.module.css';
import PatientHistoryModal from './PatientHistoryModal';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PatientHistory = ({ setSelectedMedicalHistory }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedNote, setSelectedNote] = useState(null);
  //if isReportMode, replace the ADD RECORD to PRINT CSV. that's all
  const isReportMode = location.pathname.endsWith('/reports');

  // admitting modal => shows step after clicking ADD RECORD.. kumbaga same as PATIENT ADMITTING sa /patient/add
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitStep, setAdmitStep] = useState(null);


  //copy paste REPORTS/patient-report
  const handlePrintCSV = () => {
    if (!history.length) return;
    
    // const headers = ['Case Number', 'Record Type', 'Date', 'Patient Name', 'Patient ID']; MANUAL TO AUTOMATED S ABABA

    const headers = Object.keys(history[0]);
    const rows = history.map(note => 
    headers.map(key => {
      const val = key === 'note_date' || key === 'history_date'
        ? new Date(note[key]).toLocaleDateString()
        : note[key];
      return `"${val || ''}"`;
    })
  );


    // Generate CSV content
    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${val || ''}"`).join(','))
      .join('\r\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `patient_${id}_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ───────── fetch once per patient ───────── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await fetchPatientHistoryAPI(id);
        setHistory(data);
        console.log('Patient history data:', data);
      } catch (err) {
        console.error(err);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleView = (note) => {
    setSelectedMedicalHistory(note);
    navigate(`/patients/history/${id}/casecode/${note.case_number}/historyId/${note.history_id}`);
  };

  const handleSeeMore = (note) => {
    setSelectedNote(note);
  };

  const closeModal = () => setSelectedNote(null);

  const handleAddRecordClick = () => {
    setShowAdmitModal(true);
  };

  const chooseFormType = (type) => {
    setAdmitStep(type);
    navigate(`/patients/${type}/edit/${id}`);
    setShowAdmitModal(false);
  };

  const closeAdmitModal = () => {
    setShowAdmitModal(false);
    setAdmitStep(null);
  };

  if (loading) return <div className={styles.loading}>Loading history…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Extract patient details from first history entry (assuming consistent data)
  const patient = history.length > 0 ? history[0] : {};
  
  return (
    <div className={styles.patientManagement}>
      {/* Patient Header */}      <div className={styles.headerRow}>
        <h2>Viewing Patient #{patient.code}</h2>
        {isReportMode ? (
          <button 
            className={styles.btnAdd} 
            onClick={handlePrintCSV}
          >
            <i className="fas fa-file-csv"></i> Print CSV
          </button>
        ) : (
          <button 
            className={styles.btnAdd} 
            onClick={handleAddRecordClick}
          >
            <i className="fas fa-pencil-alt"></i> Add Record
          </button>
        )}
      </div>
      
      <div className={styles.patientInfo}>
        <div>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Birth date:</strong> {new Date(patient.date_of_birth).toLocaleDateString()}</p>
          <p><strong>Patient ID:</strong> #{patient.code}</p>
        </div>
      </div>

      {/* Medical History Table */}
      <div className={styles.tableContent}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Case Number</th>
              <th>Record Type</th>
              <th>Date</th>
              
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No medical history records found.
                </td>
              </tr>
            ) : (
              history.map((note, idx) => (
                <tr
                  key={note.idx ?? `${note.case_number}-${idx}`}
                  className={styles.tableRow}
                  onClick={() => handleSeeMore(note)}
                >
                  <td>{note.case_number}</td>
                  <td>{note.type_of_admission}</td>
                  <td>
                    {new Date(note.note_date || note.history_date)
                      .toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className={styles.btnView}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(note);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedNote && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <PatientHistoryModal note={selectedNote} handleView={handleView} />
          </div>
        </div>
      )}

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
  );
};

export default PatientHistory;