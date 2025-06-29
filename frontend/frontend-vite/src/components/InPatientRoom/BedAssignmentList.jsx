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
  const [showDischargeConfirm, setShowDischargeConfirm] = useState(false);
  const [patientToDischarge, setPatientToDischarge] = useState(null);
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

  // Open discharge confirmation
  const openDischargeConfirm = (assignment) => {
    setPatientToDischarge(assignment);
    setShowDischargeConfirm(true);
  };
  
  // Handle discharge
  const handleDischarge = async () => {
    if (!patientToDischarge) return;
    
    try {
      setLoading(true);
      await dischargePatientAPI(patientToDischarge.patient);
      // after discharge, reload list
      loadAssignments();
      setShowDischargeConfirm(false);
      setPatientToDischarge(null);
    } catch (err) {
      setError('Failed to discharge patient. Please try again.');
      setLoading(false);
    }
  };

  // Cancel discharge
  const cancelDischarge = () => {
    setShowDischargeConfirm(false);
    setPatientToDischarge(null);
  };

  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(a => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      a.patient.name.toLowerCase().includes(searchLower) ||
      (a.billing && a.billing.toString().includes(searchLower)) ||
      a.bed.room.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1><i className="fa fa-bed"></i> Bed Assignments</h1>
          <div className={styles.clock}>
            <i className="fa fa-clock-o"></i> {serverTime.toLocaleString()}
          </div>
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.addButton}
            onClick={() => navigate('add-bed')}
          >
            <i className="fa fa-plus-circle"></i> New Assignment
          </button>
        </div>
      </header>

      {/* Controls Section */}
      <div className={styles.controlsPanel}>
        <div className={styles.filterToggle}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={e => setActiveOnly(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              <i className={`fa ${activeOnly ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i> 
              Show active assignments only
            </span>
          </label>
        </div>
        <div className={styles.searchContainer}>
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder="Search by patient, room or billing ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button 
              className={styles.clearSearch}
              onClick={() => setSearchTerm('')}
            >
              <i className="fa fa-times-circle"></i>
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading bed assignments...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <i className="fa fa-exclamation-circle"></i>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={loadAssignments}
          >
            <i className="fa fa-refresh"></i> Retry
          </button>
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && (
        <>
          {filteredAssignments.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th><i className="fa fa-hashtag"></i> ID</th>
                    <th><i className="fa fa-user"></i> Patient</th>
                    <th><i className="fa fa-home"></i> Room</th>
                    <th><i className="fa fa-bed"></i> Bed#</th>
                    <th><i className="fa fa-calendar-check-o"></i> Start Time</th>
                    <th><i className="fa fa-calendar-times-o"></i> End Time</th>
                    <th><i className="fa fa-hourglass-half"></i> Hours</th>
                    <th><i className="fa fa-file-text-o"></i> Billing</th>
                    <th><i className="fa fa-cogs"></i> Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map(a => (
                    <tr key={a.id} className={a.end_time ? styles.inactiveRow : styles.activeRow}>
                      <td>{a.id}</td>
                      <td className={styles.patientCell}>{a.patient.name}</td>
                      <td>{a.bed.room.name}</td>
                      <td className={styles.bedNumberCell}>{a.bed.number}</td>
                      <td>{new Date(a.start_time).toLocaleString()}</td>
                      <td>
                        {a.end_time ? (
                          <span className={styles.endTimeValue}>{new Date(a.end_time).toLocaleString()}</span>
                        ) : (
                          <span className={styles.activeStatus}>
                            <i className="fa fa-circle"></i> Active
                          </span>
                        )}
                      </td>
                      <td className={styles.hoursCell}>{a.total_hours}</td>
                      <td>
                        {a.billing ? (
                          <span className={styles.billingId}>{a.billing}</span>
                        ) : '—'}
                      </td>
                      <td>
                        {!a.end_time && (
                          <button
                            className={styles.dischargeButton}
                            onClick={() => openDischargeConfirm(a)}
                          >
                            <i className="fa fa-sign-out"></i> Discharge
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <i className="fa fa-bed"></i>
              <h3>No bed assignments found</h3>
              <p>
                {searchTerm ? 'Try changing your search term or filter' : 'Create a new bed assignment to get started'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Discharge Confirmation Modal */}
      {showDischargeConfirm && patientToDischarge && (
        <div className={styles.modalOverlay} onClick={cancelDischarge}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3><i className="fa fa-sign-out"></i> Confirm Discharge</h3>
              <button className={styles.closeButton} onClick={cancelDischarge}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to discharge this patient from their bed?</p>
              
              <div className={styles.patientDetails}>
                <div className={styles.detailItem}>
                  <strong>Patient:</strong> {patientToDischarge.patient.name}
                </div>
                <div className={styles.detailItem}>
                  <strong>Room:</strong> {patientToDischarge.bed.room.name}
                </div>
                <div className={styles.detailItem}>
                  <strong>Bed:</strong> {patientToDischarge.bed.number}
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button className={styles.cancelButton} onClick={cancelDischarge}>
                  <i className="fa fa-times"></i> Cancel
                </button>
                <button 
                  className={styles.confirmButton} 
                  onClick={handleDischarge}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.buttonSpinner}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check"></i> Confirm Discharge
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
