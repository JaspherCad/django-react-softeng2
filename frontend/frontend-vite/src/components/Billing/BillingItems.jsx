// src/components/Billing/BillingItemsOfThatBill.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BillingItemsOfThatBill.module.css';
import BillingItemsModal from './BillingItemsModal';
import { getBillingByID, getBillingItemByIdAPI } from '../../api/axios';
import axiosInstance from '../../api/axios';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import BillingPDF from '../PdfGenerator/BillingPDF';

const BillingItemsOfThatBill = ({ modalBillId, isModal = false }) => {

  // IF we're in modal mode use the prop... ELSE use URL param:
  const { billId: routeBillId } = useParams();
  const billId = isModal ? modalBillId : routeBillId;
  const navigate = useNavigate();

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


  //PDF EXPORT Modal
  const [showPDF, setShowPDF] = useState(false);

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

    await getBillingItemById(billingItemId, service_id);
    //billingItemsModal handleCreateOrUpdate for continuation
  }

  const handleAddBillingItem = () => {
    setSelectedBillingItem(null)
    setIsModalOpen(true);



  }

  const handleAddNewBilling = () => {
    // Navigate back to the main billing page to add a new billing
    navigate('/billing');
  }

  const handleMarkAsPaid = async () => {
    console.log('Marking billing as paid:', billData.code);
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/billings/${billData.code}/mark-paid`);
      
      if (response.status === 200) {
        await fetchBillingsById(billId);
      }
    } catch (err) {
      console.error('Error marking billing as paid:', err);
      alert('Failed to mark billing as paid. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const bedAssignments = items.filter(i => i.service_availed == null && i.bed_assignment);
  const serviceItems = items.filter(i => i.service_availed != null);


  // Merge bed assignments by bed ID, aggregating hours & subtotal
  const bedMap = bedAssignments.reduce((acc, item) => {
    const bedId = item.bed_assignment.bed.id;
    const hours = item.bed_assignment.total_hours;
    const cost = parseFloat(item.subtotal);
    if (!acc[bedId]) {
      acc[bedId] = {
        ...item,
        _agg_hours: hours,
        _agg_subtotal: cost
      };
    } else {
      acc[bedId]._agg_hours += hours;
      acc[bedId]._agg_subtotal += cost;
    }
    return acc;
  }, {});
  const uniqueBedAssignments = Object.values(bedMap);









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




      <div className={styles.billingButtons}>

        <button className={styles.openModalButton} onClick={handleAddBillingItem}>
          Add New Billing Item
        </button>
      
        {billStatus === 'Unpaid' && (
          <button className={styles.markPaidButton} onClick={handleMarkAsPaid}>
            Mark as Paid
          </button>
        )}
        <button className={styles.openModalButton} onClick={() => setShowPDF(true)}>
          Generate Bill
        </button>
      </div>



      {/* Bed Assignments Section */}
      <h3>Bed Assignments</h3>
      {bedAssignments.length === 0 && <p>No bed assignments.</p>}
      {bedAssignments.map((item, idx) => (
        <div key={item.id} className={styles.billingCard}>
          <div className={styles.billingCardHeader} onClick={() => toggleExpand(idx)}>
            <span>Bed {item.bed_assignment.bed.number} - {item.bed_assignment.total_hours} hrs</span>
            <button onClick={(e) => { e.stopPropagation(); handleEditBillingItem(item.id); }}>Edit</button>
          </div>
          {expandedSet.has(idx) && (
            <div className={styles.billingCardDetails}>
              <p><strong>Room:</strong> {item.bed_assignment.bed.room.name}</p>
              <p><strong>Hourly Rate:</strong> ₱{item.bed_assignment.bed.room.hourly_rate}</p>
              <p><strong>Subtotal:</strong> ₱{parseFloat(item.subtotal).toFixed(2)}</p>
            </div>
          )}
        </div>
      ))}

      {/* Service Items Section */}
      <h3>Services Availed</h3>
      {serviceItems.length === 0 && <p>No services availed.</p>}
      {serviceItems.map((item, idx) => (
        <div key={item.id} className={styles.billingCard}>
          <div className={styles.billingCardHeader} onClick={() => toggleExpand(idx + bedAssignments.length)}>
            <span>{item.service_name} × {item.quantity}</span>
            <button onClick={(e) => { e.stopPropagation(); handleEditBillingItem(item.id); }}>Edit</button>
          </div>
          {expandedSet.has(idx + bedAssignments.length) && (
            <div className={styles.billingCardDetails}>
              <p><strong>Service ID:</strong> {item.service_availed}</p>
              <p><strong>Unit Price:</strong> ₱{(item.subtotal / item.quantity).toFixed(2)}</p>
              <p><strong>Subtotal:</strong> ₱{parseFloat(item.subtotal).toFixed(2)}</p>
            </div>
          )}
        </div>
      ))}

      {isModalOpen && <BillingItemsModal
        closeModal={closeModal}
        billingItem={selectedBillingItem}
        loading={loading}
        error={error}
        billId={billData.id}
        billCode={billId}
        setReloadCount={setReloadCount}

      />}


      {showPDF && (
        <div className={styles.pdfModal}>
          <div className={styles.pdfViewerContainer}>
            <button
              className={styles.closeButton}
              onClick={() => setShowPDF(false)}
            >
              ×
            </button>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
              <BillingPDF billingData={billData} />
            </PDFViewer>
          </div>
        </div>
      )}




      {/*Billing Items List */}
      
    </div>
  );
};

export default BillingItemsOfThatBill;
