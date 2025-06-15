// src/pages/BedRental/ConfirmationStep.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../../api/client'
import styles from './Confirmation.module.css'

export default function Confirmation() {
  const { assignmentId } = useParams()
  const [assignment, setAssignment] = useState(null)

  useEffect(() => {
    axios.get(`/bed-assignments/${assignmentId}/`)
      .then(res => setAssignment(res.data))
  }, [assignmentId])

  if (!assignment) return <p className={styles.loading}>Loading confirmation…</p>

  return (
    <div className={styles.page}>
      <h2>✅ Bed Assigned!</h2>
      <p><strong>Patient:</strong> {assignment.patient.name}</p>
      <p><strong>Room:</strong> {assignment.bed.room.name}</p>
      <p><strong>Bed:</strong> {assignment.bed.number}</p>
      <p><strong>Start:</strong> {new Date(assignment.start_time).toLocaleString()}</p>
      <Link to="/rent-bed" className={styles.button}>
        Assign Another Bed
      </Link>
    </div>
  )
}
