import React from 'react';
import styles from './BillingFormModal.module.css';

const BillingFormModal = ({ show, onClose, children, title = "Billing Form" }) => {
  if (!show) return null; 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2><i className="fa fa-file-text-o"></i> {title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BillingFormModal;
