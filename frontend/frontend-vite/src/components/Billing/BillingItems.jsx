// src/components/Billing/BillingItemsOfThatBill.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './BillingItemsOfThatBill.module.css';
import BillingItemsModal from './BillingItemsModal';
import { getBillingByID, getBillingItemByIdAPI } from '../../api/axios';

const BillingItemsOfThatBill = () => {
  const { billId } = useParams();

  const [billData, setBillData] = useState(null);    // fetched billing object
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [expandedSet, setExpandedSet] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  // where we return the fetched billing item by id WHICH can be send to billingItem modal for edit 
  const [selectedBillingItem, setSelectedBillingItem] = useState(null);


   // This “reloadCount” is our simple trigger. parent(this) refetches... triggered on MODAL
  const [reloadCount, setReloadCount] = useState(0);



  const fetchBillingsById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getBillingByID(id);
      setBillData(response.data);
    } catch (err) {
      console.error('Error fetching billing by ID:', err);
      setError('Failed to load billing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingsById(billId);
  }, [billId, reloadCount]); //in modal, if status 200 increment it (ON MODAL)



  const getBillingItemById = async (billingitemId, service_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBillingItemByIdAPI(billingitemId);
      //setBillData(response.data);
      console.log(response.data)
      setSelectedBillingItem(response.data);
    } catch (err) {
      console.error('Error getBillingItemByIdAPI:', err);
      setError('Failed to load getBillingItemByIdAPI data.');
    } finally {
      setLoading(false);
    }
  }


  const toggleExpand = (idx) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };


  //COLAPSE THIS RANGE just pseudocode personal note
  //findById (not code) of billingItems first.. 


  //if edit, fill this info below using FETCHBILLINGSITEMBYID
  //or maybe by sending an object  then destrcuture inside BillingItemsModal
  // const [service, setService] = useState('')
  // const [quantity, setQuantity] = useState(1)
  // const [costAtTime, setCostAtTime] = useState(0)
  //then send as props to BillingItems modal...
  //ps: billingItems modal handles the edit function.

  //if add+, clear those 3 then just open the modal.. send blank or default values
  //of the three as props
  //ps: billingItems modal handles the add function.



  const handleEditBillingItem = async (billingItemId, service_id) => {
    setIsModalOpen(true);
    alert(`http://127.0.0.1:8000/api/billings/${billId}/items/${billingItemId}/edit`)

    await getBillingItemById(billingItemId, service_id);
      //billingItemsModal handleCreateOrUpdate for continuation
  }

  const handleAddBillingItem = () => {
    setSelectedBillingItem(null)
    setIsModalOpen(true);

    
    
  }








  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const togglePatientInfo = () => setShowPatientInfo((prev) => !prev);



  if (loading) {
    return <p className={styles.loadingText}>Loading billing details…</p>;
  }

  if (error) {
    return <p className={styles.errorText}>{error}</p>;
  }

  if (!billData) {
    return <p className={styles.noSelection}>No billing found.</p>;
  }

  console.log(billData)

  // adjust data names to pre-ui done
  const {
    code,
    id,
    patient,
    date_created,
    status: billStatus,
    total_due,
    billing_items: items,
    created_by,
    operator,
    service_id
  } = billData;

  const {
    code: patientCode,
    name: patientName,
    status: patientStatus,
    admission_date,
    current_condition,
    date_of_birth,
    address,
    discharge_date,
    phone,
    email,
    emergency_contact_name,
    emergency_contact_phone,
    is_active: patientIsActive,
  } = patient;

  return (
    <div className={styles.billingContainer}>
      {/*Bill Head*/}
      <h2 className={styles.billingHeader}>
        Bill #{code} – {patientName}{' '}
        <span
          className={
            billStatus === 'Unpaid'
              ? `${styles.statusBadge} ${styles.unpaid}`
              : `${styles.statusBadge} ${styles.paid}`
          }
        >
          {billStatus}
        </span>
      </h2>




      {/*Patient Information Toggle */}
      <div className={styles.patientToggleContainer}>
        <button
          className={styles.patientToggleButton}
          onClick={togglePatientInfo}
        >
          {showPatientInfo ? 'Hide Patient Information ▲' : 'Show Patient Information ▼'}
        </button>
      </div>





      {showPatientInfo && (
        <div className={styles.patientBox}>
          <h3>Patient Information</h3>
          <p>
            <strong>Patient Code:</strong> {patientCode}
          </p>
          <p>
            <strong>Name:</strong> {patientName}
          </p>
          <p>
            <strong>Status:</strong> {patientStatus}
          </p>
          <p>
            <strong>Admission Date:</strong>{' '}
            {new Date(admission_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Discharge Date:</strong>{' '}
            {discharge_date
              ? new Date(discharge_date).toLocaleDateString()
              : 'N/A'}
          </p>
          <p>
            <strong>Date of Birth:</strong>{' '}
            {new Date(date_of_birth).toLocaleDateString()}
          </p>
          <p>
            <strong>Current Condition:</strong> {current_condition}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Emergency Contact:</strong> {emergency_contact_name} (
            {emergency_contact_phone})
          </p>
          <p>
            <strong>Active:</strong> {patientIsActive ? 'Yes' : 'No'}
          </p>
        </div>
      )}




      {/* PRE-Billing Meta Information */}
      <div className={styles.billingMeta}>
        <h3>Billing Details</h3>
        <p>
          <strong>Billing ID:</strong> {id}
        </p>
        <p>
          <strong>Created On:</strong>{' '}
          {new Date(date_created).toLocaleString()}
        </p>
        <p>
          <strong>Total Due:</strong> ₱{parseFloat(total_due).toFixed(2)}
        </p>
        <p>
          <strong>Created By:</strong> {created_by.role} (User ID:{' '}
          {created_by.user_id})
        </p>
        <p>
          <strong>Department:</strong> {created_by.department}
        </p>
        <p>
          <strong>Operators:</strong>{' '}
          {operator.map((op) => `${op.role} (User ID: ${op.user_id})`).join(
            ', '
          )}
        </p>
      </div>





      <button className={styles.openModalButton} onClick={handleAddBillingItem}>
        Add New Billing
      </button>

      {isModalOpen && <BillingItemsModal
        closeModal={closeModal}
        billingItem={selectedBillingItem}
        loading={loading}
        error={error}
        billId={billData.id}
        billCode={billId}
        setReloadCount={setReloadCount}  
        
      />}




      {/*Billing Items List */}
      <div className={styles.billingItemsList}>
        <h3>Billing Items</h3>
        {items.length === 0 && (
          <p className={styles.noItems}>No billing items available.</p>
        )}
        {items.map((item, idx) => {
          const isExpanded = expandedSet.has(idx);
          return (
            <div
              key={item.id}
              className={`${styles.billingCard} ${isExpanded ? styles.expanded : ''
                }`}
              onClick={() => toggleExpand(idx)}
            >








              {/* CARD HEADER */}
              <div className={styles.billingCardHeader}>
                <div className={styles.cardSummary}>
                  <span className={styles.serviceText}>
                    {item.service_name} (₱
                    {parseFloat(item.subtotal).toFixed(2)})
                  </span>
                  <span className={styles.quantityText}>
                    × {item.quantity}
                  </span>
                </div>

                <button
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    // setIsModalOpen(true);
                    handleEditBillingItem(item.id, service_id)
                  }}
                >
                  EDIT
                </button>
              </div>













              {/*EXPANDED DETAILS */}
              {isExpanded && (
                <div className={styles.billingCardDetails}>
                  <div>
                    <strong>Billing_item ID:</strong> {item.id}
                  </div>
                  <div>
                    <strong>Service Availed ID:</strong> {item.service_availed}
                  </div>
                  <div>
                    <strong>Service Name:</strong> {item.service_name}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {item.quantity}
                  </div>
                  <div>
                    <strong>Subtotal:</strong> ₱{parseFloat(item.subtotal).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillingItemsOfThatBill;
