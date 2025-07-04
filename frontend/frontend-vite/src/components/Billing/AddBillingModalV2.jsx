import React from 'react';
import styles from './BillingFormModal.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import { addBillingsApi, SearchPatientsApi } from '../../api/axios';
import SearchBar from '../AngAtingSeachBarWIthDropDown/index';

const AddBillingModalV2 = ({ show, onClose, setModalOpen }) => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = (filtered) => {
    setPatient(filtered || '');
    console.log(filtered?.code);
    setShowConfirmModal(true);
  }

  const handleConfirm = async () => {
    const data = {
      patient: parseInt(patient.id),
      status: 'Unpaid'
    }

    setIsLoading(true);
    try {
      const response = await addBillingsApi(data);

      if (response?.status === 200 || response?.status === 201) {
        console.log('Billing successfully added');
        console.log('New billing data:', response.data);
        
        setError('');
        setShowConfirmModal(false);
        setModalOpen(false);
        
        // Redirect to the newly created billing
        // Assuming the response contains the billing ID or code
        const billingId = response.data.id || response.data.code;
        if (billingId) {
          navigate(`/billing/${billingId}`);
        }
      } else {
        console.log('Failed to add billing:', response);
      }
    } catch (error) {
      console.log(error.response.data);
      const errormsg = error?.response?.data?.patient;
      setError(errormsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2><i className="fa fa-plus-circle"></i> Create New Billing</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.searchInstructions}>
            <div className={styles.searchIcon}>
              <i className="fa fa-search"></i>
            </div>
            <div className={styles.instructionText}>
              <h3>Find Patient for Billing</h3>
              <p>Search by patients code or name to create a new billing record</p>
            </div>
          </div>

          <div className={styles.searchBarWrapper}>
            <SearchBar
              placeholder={"Search by patients code or name"}
              searchApi={SearchPatientsApi}
              onSelectSuggestion={(filtered) => {
                handleSubmit(filtered)
                setSearchTerm(filtered?.name || '');
                setIsDropdownVisible(false);
              }}
              isIDIncludedInResultSuggestion={false}
              suggestedOutput={['code', 'name']}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
              maxDropdownHeight="300px"
            />
          </div>

          {/* Confirmation Modal */}
          <ConfirmationModal
            show={showConfirmModal}
            title="Confirm New Billing"
            message={
              patient ? (
                <div className={styles.confirmationContent}>
                  <p>Create a new billing record for:</p>
                  <div className={styles.patientConfirmBox}>
                    <i className="fa fa-user-circle"></i>
                    <div className={styles.patientConfirmInfo}>
                      <strong>{patient.name}</strong>
                      <span>Patient ID: {patient.code}</span>
                    </div>
                  </div>
                </div>
              ) : "Select a patient"
            }
            onConfirm={handleConfirm}
            onCancel={() => { setShowConfirmModal(false); setError('') }}
            errorMsg={error}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddBillingModalV2;
