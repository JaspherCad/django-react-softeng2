import React from 'react';
import styles from './BillingFormModal.module.css';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { addBillingsApi } from '../../api/axios';

const AddBillingModal = ({ show, onClose, setModalOpen }) => { //these are props remember

  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState()

  //confirmaton modal section
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  //confirmaton modal section


  if (!show) return null;

  
  const handleSubmit = (e) => {
    e.preventDefault()
    setShowConfirmModal(true);
  }


  const handleConfirm = async () => {
    const data = {
      patient: parseInt(patientId, 10),
      status: 'Unpaid'
    }
    
    console.log(data)
    try{
      console.log(data)
      const response = await addBillingsApi(data)
      
      if (response?.status === 200 ||  response?.status === 201) {
        console.log('Billing successfully added');
        setError('')
        setShowConfirmModal(false);
        setModalOpen(false); 
      } else {
        console.log('Failed to add billing:', response);
      }

      
    }catch(error){
      console.log(error.response.data.patient)
      const errormsg = error?.response?.data?.patient 
      alert(errormsg)

      //DESIGNER PLEASE DESIGN THIS HAHA! 
      //set error msg
      setError(errormsg)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={() => console.log('modal triggered')}>
      <div className={styles.modalContent} onClick={(e) => {
        e.stopPropagation()
        console.log('just content because ofstopPropagation ')
        }
        
        }>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <label>
            PatientId
            <input
              type='text'
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)} />

            
          </label>
          <input type="submit" value="ADD BILL" />
        </form>





        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showConfirmModal}
          title="Add New Billing?"
          message={`patientId: ${patientId}`}
          onConfirm={handleConfirm}
          onCancel={() => {setShowConfirmModal(false); setError('')}}
          errorMsg={error}
        />

      </div>
    </div>
  );
};

export default AddBillingModal;
