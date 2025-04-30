import React from 'react'
import styles from './ConfirmationModal.module.css'; // We'll also create a simple css file

const ConfirmationModal = ({show, title = "Confirm Action", onConfirm, message = "Are you sure you want to proceed?", onCancel, errorMsg}) =>  {
    if (!show) return null;
    console.log(errorMsg)
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>{title}</h2>
          <p>{message}</p>

          {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}

          <div className={styles.buttonGroup}>
            <button onClick={onConfirm} className={styles.confirmButton}>
              CONFIRM
            </button>
            <button onClick={onCancel} className={styles.cancelButton}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;