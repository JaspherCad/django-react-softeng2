// src/pages/BedRental/BedRentalLayout.jsx
import React from 'react'
import { Link, Outlet, useMatch, useNavigate } from 'react-router-dom'
import styles from './BedRentalLayout.module.css'

export default function BedRentalLayout() {
  const navigate = useNavigate();

  const step1 = useMatch('/InPatientRoom')
  const step2 = useMatch('/InPatientRoom/choose-bed/*')
  const step3 = useMatch('/InPatientRoom/confirmation/*')


  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)}>
          ← Back
        </button>

        <nav className={styles.steps}>
          <span className={`${styles.step} ${step1 ? styles.stepActive : ''}`}>1. Billing</span>
          <span className={`${styles.step} ${step2 ? styles.stepActive : ''}`}>2. Room &amp; Bed</span>
          <span className={`${styles.step} ${step3 ? styles.stepActive : ''}`}>3. Confirm</span>
        </nav>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
