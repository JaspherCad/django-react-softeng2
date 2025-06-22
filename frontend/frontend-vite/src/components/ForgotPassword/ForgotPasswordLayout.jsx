// src/pages/forgot-password/ForgotPasswordLayout.jsx
import React from 'react'
import { useState, createContext } from 'react'

import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import styles from './ForgotPassword.module.css'


export const ForgotPasswordContext = createContext()

const steps = [
  { id: 1, label: 'Enter User ID', path: 'enter-id' },
  { id: 2, label: 'Security Question', path: 'security-question' },
  { id: 3, label: 'Reset Password', path: 'reset' },
]

export default function ForgotPasswordLayout() {


  const [userId,      setUserId     ] = useState('')
  const [questions,   setQuestions  ] = useState([])
  const [answers,     setAnswers    ] = useState({})   
  const [resetToken,  setResetToken ] = useState(null)


  const { pathname } = useLocation()
  const navigate = useNavigate()


  const currentStep = steps.findIndex(s => pathname.endsWith(s.path)) + 1

  return (
    <div className={styles.fpContainer}>
      <div className={styles.fpCard}>
        <div className={styles.header}>
          <img src="/your-logo.png" alt="Hospital Logo" className={styles.logo} />
          <h5 className={styles.title}>Antipolo Centro De Medikal Hospital</h5>
          <p className={styles.subtitle}>Reset Password</p>
        </div>

        <div className={styles.stepsWrapper}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`${styles.circle} ${currentStep === step.id ? styles.active : ''} ${currentStep > step.id ? styles.completed : ''}`}>
                {step.id}
              </div>
              {idx < steps.length - 1 && <div className={styles.line} />}
            </React.Fragment>
          ))}
        </div>

        {currentStep > 1 && (
          <button
            className={styles.backButton}
            onClick={() => navigate(`/forgot-password/${steps[currentStep - 2].path}`)}
          >
            &larr; Back
          </button>
        )}




        {/* 3) Provide all state & setters to children */}
        <ForgotPasswordContext.Provider
          value={{
            userId, setUserId,
            questions, setQuestions,
            answers, setAnswers,
            resetToken, setResetToken
          }}



        >

          <div className={styles.outletWrapper}>
            <Outlet />
          </div>
        </ForgotPasswordContext.Provider>







        <div className={styles.footerLink}>
          <Link to="/" className={styles.backToLogin}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}