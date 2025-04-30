import React from 'react';
import styles from './BillingFormModal.module.css';

const BillingFormModal = ({ show, onClose, children }) => {
  if (!show) return null; 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default BillingFormModal;
