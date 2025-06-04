import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './BillingItemsOfThatBill.module.css';
import BillingItemsModal from './BillingItemsModal';

const BillingItemsOfThatBill = () => {
  const { billId } = useParams();

  const billInfo = {
    id: billId,
    customer: 'Jaspher Cadelina',
    status: 'Unpaid',
  };

  const items = [
    {
      service: 'blood test (₱99.00)',
      quantity: 1,
      subtotal: 99.0,
      description: 'Complete blood count, includes CBC and differential.',
    },
    {
      service: 'blood test (₱99.00)',
      quantity: 1,
      subtotal: 99.0,
      description: 'Lipid panel to check cholesterol levels.',
    },
    {
      service: 'blood test (₱99.00)',
      quantity: 1,
      subtotal: 99.0,
      description: 'Liver function test (LFT).',
    },
    {
      service: 'blood test (₱99.00)',
      quantity: 1,
      subtotal: 99.0,
      description: 'Kidney function test (KFT).',
    },
    {
      service: 'blood test (₱99.00)',
      quantity: 1,
      subtotal: 99.0,
      description: 'Thyroid-stimulating hormone (TSH) level.',
    },
    {
      service: 'blood test (₱99.00)',
      quantity: 1,
      subtotal: 99.0,
      description: 'Blood glucose (fasting).',
    },
    {
      service: 'blood test (₱99.00)',
      quantity: 1,
      subtotal: 99.0,
      description: 'Hemoglobin A1c (HbA1c).',
    },
    {
      service: 'blood test (₱120.00)',
      quantity: 1,
      subtotal: 120.0,
      description: 'Vitamin D level assessment.',
    },
  ];

  // Track which items are expanded (by index)
  const [expandedSet, setExpandedSet] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleExpand = (idx) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.billingContainer}>
      <h2 className={styles.billingHeader}>
        Bill #{billInfo.id} – {billInfo.customer}{' '}
        <span
          className={
            billInfo.status === 'Unpaid'
              ? `${styles.statusBadge} ${styles.unpaid}`
              : `${styles.statusBadge} ${styles.paid}`
          }
        >
          {billInfo.status}
        </span>
      </h2>

      <button className={styles.openModalButton} onClick={openModal}>
        Open Modal
      </button>



















      {isModalOpen && (
        <BillingItemsModal closeModal={closeModal}/>
      )}















      <div className={styles.billingItemsList}>
        {items.map((item, idx) => {
          const isExpanded = expandedSet.has(idx);
          return (
            <div
              key={idx}
              className={`${styles.billingCard} ${isExpanded ? styles.expanded : ''
                }`}
              onClick={() => toggleExpand(idx)}
            >







              {/* CARD HEADER */}
              <div className={styles.billingCardHeader}>
                <div className={styles.cardSummary}>
                  <span className={styles.serviceText}>{item.service}</span>
                  <span className={styles.subtotalText}>
                    ₱{item.subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true)
                  }}
                >
                  EDIT
                </button>
              </div>

              {/* EXPANDED DETAILS */}
              {isExpanded && (
                <div className={styles.billingCardDetails}>
                  <div>
                    <strong>Service:</strong> {item.service}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {item.quantity}
                  </div>
                  <div>
                    <strong>Subtotal:</strong> ₱{item.subtotal.toFixed(2)}
                  </div>
                  <div>
                    <strong>Description:</strong> {item.description}
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