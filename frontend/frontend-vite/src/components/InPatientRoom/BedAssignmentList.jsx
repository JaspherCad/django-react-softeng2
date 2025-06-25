// src/pages/BedAssignments/BedAssignmentList.jsx
import React, { useEffect, useState } from 'react';
import styles from './BedAssignmentList.module.css';
import { fetchBedAssignments, fetchServerTime, dischargePatientAPI } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function BedAssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOnly, setActiveOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverTime, setServerTime] = useState(new Date());
  const navigate = useNavigate();

  // Fetch initial server time
  useEffect(() => {
    fetchServerTime()
      .then(res => setServerTime(new Date(res.data.server_time)))
      .catch(() => {});
  }, []);

  // Tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load assignments when activeOnly toggles
  const loadAssignments = () => {
    setLoading(true);
    setError(null);
    fetchBedAssignments(activeOnly)
      .then(data => setAssignments(data))
      .catch(() => setError('Failed to load assignments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAssignments();
  }, [activeOnly]);

  // Handle discharge
  const handleDischarge = async (patientId) => {
    console.log(patientId.patient)
    try {
      await dischargePatientAPI(patientId.patient);
      // after discharge, reload list
      loadAssignments();
    } catch {
      alert('Failed to discharge patient');
    }
  };

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2>Bed Assignments</h2>
        <div>
          <button
            className={styles.addBtn}
            onClick={() => navigate('add-bed')}
          >
            + Add New Assignment
          </button>
        </div>
        <div className={styles.clock}>
          Server time: {serverTime.toLocaleString()}
        </div>
      </header>

      <div className={styles.controls}>
        <label>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={e => setActiveOnly(e.target.checked)}
          />{' '}
          Show active only
        </label>
        <input
          type="text"
          placeholder="Search by patient or billing ID…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Room</th>
              <th>Bed#</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Hrs</th>
              <th>Billing ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patient.name}</td>
                <td>{a.bed.room.name}</td>
                <td>{a.bed.number}</td>
                <td>{new Date(a.start_time).toLocaleString()}</td>
                <td>{a.end_time ? new Date(a.end_time).toLocaleString() : '—'}</td>
                <td>{a.total_hours}</td>
                <td>{a.billing || '—'}</td>
                <td>
                  <button
                    className={styles.dischargeBtn}
                    onClick={() => handleDischarge(a)}
                  >
                    Discharge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
