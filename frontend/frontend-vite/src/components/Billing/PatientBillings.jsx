import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBillingsByPatientAPI, patientDetailsAPI } from '../../api/axios';
import styles from './Billing.module.css';

const PatientBillings = () => {
  const { patientId } = useParams();
  const [billings, setBillings] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientAndBillings = async () => {
      try {
        setLoading(true);
        
        // Get patient details
        const patientResponse = await patientDetailsAPI(patientId);
        setPatient(patientResponse.data);
        
        // Get patient billings
        const billingsResponse = await getBillingsByPatientAPI(patientId);
        setBillings(billingsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient billings:', err);
        setError('Failed to load patient billings. Please try again.');
        setLoading(false);
      }
    };

    fetchPatientAndBillings();
  }, [patientId]);

  const handleViewBillingDetails = (billingCode) => {
    navigate(`/billing/billing_items_of_billing/${billingCode}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalAmount = () => {
    return billings.reduce((total, billing) => {
      return total + parseFloat(billing.total_due);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading patient billings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/billing')}
        >
          Back to Billing
        </button>
      </div>
    );
  }

  return (
    <div className={styles.patientBillingsContainer}>
      <div className={styles.patientBillingsHeader}>
        <h2>Billings for Patient</h2>
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/billing')}
        >
          Back to Billing
        </button>
      </div>

      {patient && (
        <div className={styles.patientInfoCard}>
          <h3>Patient Information</h3>
          <div className={styles.patientInfoGrid}>
            <div>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Code:</strong> {patient.code}</p>
            </div>
            <div>
              <p><strong>Status:</strong> {patient.status}</p>
              <p><strong>Phone:</strong> {patient.phone || "N/A"}</p>
            </div>
            <div>
              <p><strong>Total Billings:</strong> {billings.length}</p>
              <p><strong>Total Amount:</strong> ${calculateTotalAmount()}</p>
            </div>
          </div>
        </div>
      )}

      {billings.length > 0 ? (
        <>
          <table className={styles.billingsTable}>
            <thead>
              <tr>
                <th>Billing Code</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Total Due</th>
                <th>Items</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((billing) => (
                <tr key={billing.id} className={styles.billingRow}>
                  <td>{billing.code}</td>
                  <td>{formatDate(billing.date_created)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[billing.status.toLowerCase()]}`}>
                      {billing.status}
                    </span>
                  </td>
                  <td>${parseFloat(billing.total_due).toFixed(2)}</td>
                  <td>{billing.billing_items.length}</td>
                  <td>{billing.created_by ? `${billing.created_by.first_name} ${billing.created_by.last_name}` : 'N/A'}</td>
                  <td>
                    <button 
                      className={styles.viewButton}
                      onClick={() => handleViewBillingDetails(billing.code)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className={styles.noBillingsMessage}>
          <p>No billings found for this patient.</p>
        </div>
      )}
    </div>
  );
};

export default PatientBillings;
