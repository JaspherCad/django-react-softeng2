import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientHistoryAPI } from '../../api/axios';
import styles from './Patients.module.css';

const PatientHistory = ({ setSelectedMedicalHistory }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    navigate(`/patients/history/${id}/casecode/${note.case_number}`);

  };

  if (loading) return <div className={styles.loading}>Loading history…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.patientManagement}>
      <h2>Medical History for Patient #{id}</h2>

      <div className={styles.tableContent}>
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
                  /* safe unique key */
                  key={note.idx ?? `${note.case_number}-${idx}`}
                  className={styles.tableRow}
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
                      VIEW
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;