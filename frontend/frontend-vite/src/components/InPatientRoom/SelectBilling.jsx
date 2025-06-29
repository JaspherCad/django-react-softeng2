// src/pages/BedRental/BillingSearchStep.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SelectBilling.module.css'
import SearchBar from "../AngAtingSeachBarWIthDropDown";
import { SearchBillingsApi, SearchBillingsApiAdmittedOnly } from '../../api/axios';

export default function SelectBilling({selectedBilling, setSelectedBilling}) {
  const [billing, setBilling] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  //REQUIRED STATES FOR SEARCHBAR
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar

  const navigate = useNavigate()

  const onSelect = async (selectedItem) => {
    setLoading(true)
    setError(null)
    try {
      setBilling(selectedItem)
      setSelectedBilling(selectedItem)
      setIsDropdownVisible(false)
      setSearchTerm(selectedItem.code)
    } catch (err) {
      setError('Failed to retrieve billing details. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const proceed = () => {
    navigate(`choose-bed/${billing.id}`)
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.stepIndicator}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepLabel}>Billing Selection</div>
        </div>
        <h2><i className="fa fa-file-text-o"></i> Search Existing Billing</h2>
      </div>

      <div className={styles.card}>
        <div className={styles.searchSection}>
          <div className={styles.searchIcon}>
            <i className="fa fa-search"></i>
          </div>
          <div className={styles.searchBarWrapper}>
            <label className={styles.searchLabel}>Find a patient's billing record</label>
            <SearchBar
              placeholder={"Search by billing code or patient name"}
              searchApi={SearchBillingsApiAdmittedOnly}
              onSelectSuggestion={(filtered) => onSelect(filtered)}
              isIDIncludedInResultSuggestion={false}
              suggestedOutput={['code', 'patient', 'status']}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Fetching billing information...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <i className="fa fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      )}
      
      {billing && !loading && (
        <div className={styles.billingCard}>
          <div className={styles.billingHeader}>
            <div className={styles.patientInfo}>
              <i className="fa fa-user-circle"></i>
              <h3>{billing.patient.name}</h3>
            </div>
            <span className={`${styles.statusBadge} ${styles[billing.status.toLowerCase()]}`}>
              {billing.status}
            </span>
          </div>

          <div className={styles.billingDetails}>
            <div className={styles.detailItem}>
              <i className="fa fa-hashtag"></i>
              <div className={styles.detailText}>
                <label>Billing ID</label>
                <p>{billing.id}</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <i className="fa fa-user"></i>
              <div className={styles.detailText}>
                <label>Patient</label>
                <p>{billing.patient.name}</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <i className="fa fa-tag"></i>
              <div className={styles.detailText}>
                <label>Status</label>
                <p>{billing.status}</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <i className="fa fa-money"></i>
              <div className={styles.detailText}>
                <label>Total Due</label>
                <p className={styles.amount}>₱{billing.total_due}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardActions}>
            <button className={styles.proceedButton} onClick={proceed}>
              <span>Next: Choose Bed</span>
              <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {!billing && !loading && (
        <div className={styles.emptyState}>
          <i className="fa fa-info-circle"></i>
          <p>Search and select a patient billing record to continue</p>
        </div>
      )}
    </div>
  )
}
