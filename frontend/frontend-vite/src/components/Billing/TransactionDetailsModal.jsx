// TransactionDetailsModal.jsx
import React, { useState } from 'react';
import styles from './TransactionDetailsModal.module.css';
import BillingItemsOfThatBill from './BillingItems';

const TransactionDetailsModal = ({ transaction, onClose }) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>×</button>

          <h2>Transaction Details</h2>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Transaction ID:</span>
              <span className={styles.value}>{transaction.code}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Patient:</span>
              <span className={styles.value}>{transaction.patient.name}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Date:</span>
              <span className={styles.value}>{new Date(transaction.date_created).toLocaleString()}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.statusBadge} ${styles[`status-${transaction.status.toLowerCase()}`]}`}>
                {transaction.status}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Total Due:</span>
              <span className={styles.value}>₱{transaction.total_due}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Created By:</span>
              <span className={styles.value}>
                {transaction.created_by.user_id} ({transaction.created_by.role})
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Operators:</span>
              <ul className={styles.operatorsList}>
                {transaction.operator.map(op => (
                  <li key={op.id}>
                    {op.user_id} ({op.role})
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Billing Itemss:</span>
              {transaction.billing_items && transaction.billing_items.length > 0 ? (
                <ul className={styles.billingItemsList}>
                  {transaction.billing_items.map(item => (
                    <li key={item.id}>
                      {item.service_availed} - ₱{item.subtotal}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className={styles.value}>No items found</span>
              )}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button className={styles.primaryAction}>Mark as Paid</button>
            <button
              className={styles.secondaryAction}
              onClick={() => setShowReceiptModal(true)}>Download Receipt</button>
          </div>
        </div>
      </div>



      {/* Nested <COMPONENT> </COMPONENT> modal */}
      {showReceiptModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowReceiptModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '800px', width: '90%' }}
          >
            <button
              className={styles.closeButton}
              onClick={() => setShowReceiptModal(false)}
            >×</button>

            {/* Render BillingItemsOfThatBill  here */}
            <BillingItemsOfThatBill
              modalBillId={transaction.code}
              isModal={true}
            />
          </div>
        </div>
      )}
    </>









  );
};

export default TransactionDetailsModal;