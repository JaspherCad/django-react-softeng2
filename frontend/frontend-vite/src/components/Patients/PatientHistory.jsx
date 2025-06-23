import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientHistoryAPI } from '../../api/axios';
import styles from './Patients.module.css';
import PatientHistoryModal from './PatientHistoryModal';

const PatientHistory = ({ setSelectedMedicalHistory }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedNote, setSelectedNote] = useState(null);




  //admitting modal
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitStep, setAdmitStep] = useState(null); // 'inpatient' or 'outpatient'

  /* ───────── fetch once per patient ───────── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await fetchPatientHistoryAPI(id);
        setHistory(data);
        console.log(data)
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
    console.log(note.case_number)
    navigate(`/patients/history/${id}/casecode/${note.case_number}/historyId/${note.history_id}`);

  };

  const handleSeeMore = (note) => {
    setSelectedNote(note);
    console.log(note)

  }

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

  return (
    <div className={styles.patientManagement}>
      <h2>Medical History for Patiesnt #{id}</h2>
      <button className={styles.btnAddRecord} onClick={handleAddRecordClick}>
        Add Record
      </button>      <div className={styles.tableContent}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Record Type</th>
              <th>Case #</th>
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
                  <td>{note.status}</td>
                  <td>{note.case_number}</td>
                  <td>
                    {new Date(note.note_date || note.history_date)
                      .toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleView(note)}
                    >
                      VIEWs
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>





















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

      {/* Modal for selecting form type */}
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

      {/* Existing modal for viewing note */}
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
    </div>
  );
};

export default PatientHistory;