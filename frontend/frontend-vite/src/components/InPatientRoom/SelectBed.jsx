// src/pages/BedRental/RoomSelectionStep.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './SelectBed.module.css'
import { fetchRooms, getBillingByACTUALIDandNotCODE, assignBed } from '../../api/axios'

export default function SelectBed({ selectedBed, setSelectedBed, selectedRoom, setSelectedRoom }) {
  const { billingId, patientId } = useParams()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [assigning, setAssigning] = useState(false)


  // State for modal
  const [showModal, setShowModal] = useState(false)
  const [fullBilling, setFullBilling] = useState(null)

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms();
        console.log(response.data);

        setRooms(response.data);
      } catch (err) {
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }

    }

    loadRooms()
  }, [])

  const openConfirmation = async () => {
    setAssigning(true)
    try {
      const { data } = await getBillingByACTUALIDandNotCODE(billingId)
      setFullBilling(data)
      setShowModal(true)
    } catch (e) {
      console.error(e)
      setError('Could not fetch billing details')
    } finally {
      setAssigning(false)
    }
  }

  const handleProceed = async () => {
    console.log('Proceeding with:')
    console.log('Billing:', fullBilling)
    console.log('Room:', selectedRoom)
    console.log('Bed:', selectedBed)
    //                PatientID   /  bedID   /   billingID
    console.log(`http://127.0.0.1:8000/api/assign-bed/${fullBilling.patient.id}/${selectedBed.id}/${fullBilling.id}`)
    try {
      const { data } = await assignBed(fullBilling.patient.id, selectedBed.id, fullBilling.id);
      console.log('Assignment successful:', data);
      setShowModal(false);
      navigate(`/InPatientRoom`);
    } catch (error) {
      console.error('Error assigning bed:', error);
      setError('Bed assignment failed. Please try again.');
    } finally {
      setAssigning(false);
    }
  };


  if (loading) return <p>Loading rooms…</p>
  if (error) return <p className={styles.error}>{error}</p>

  return (
    <div className={styles.page}>
      <h2>2. Select Room & Bed</h2>
      <div className={styles.grid}>
        {rooms.map(room => (
          <div
            key={room.id}
            className={`${styles.card} ${selectedRoom?.id === room.id ? styles.cardSelected : ''
              }`}
            onClick={() => {
              setSelectedRoom(room)
              setSelectedBed(null)
              setError(null)
            }}
          >
            <h3>{room.name}</h3>
            <p>₱{room.hourly_rate}/hr</p>
            {selectedRoom?.id === room.id && (
              <div className={styles.bedList}>
                {room.beds.map(bed => (
                  <button
                    key={bed.id}
                    disabled={bed.is_occupied}
                    className={`${styles.bedBtn} ${bed.is_occupied
                      ? styles.bedBtnOccupied
                      : selectedBed?.id === bed.id
                        ? styles.bedBtnChosen
                        : ''
                      }`}
                    onClick={e => {
                      e.stopPropagation()
                      setSelectedBed(bed)
                      setError(null)
                    }}
                  >
                    Bed {bed.number}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedBed && (
        <button
          className={`${styles.confirm}`}
          onClick={openConfirmation}
          disabled={assigning}
        >
          {assigning ? 'Assigning…' : `Confirm Bed ${selectedBed.number}`}
        </button>
      )}
      {error && <p className={styles.error}>{error}</p>}

      {/* Confirmation Modal */}
      {showModal && fullBilling && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Assignment</h3>
            <div className={styles.modalContent}>
              <p>
                <strong>Patient:</strong> {fullBilling.patient.name}
              </p>
              <p>
                <strong>Billing ID:</strong> {fullBilling.id} (
                {fullBilling.status})
              </p>

              <p>
                <strong>Billing CODE:</strong> {fullBilling.code}
              </p>
              <hr />
              <p>
                <strong>Room:</strong> {selectedRoom.name} @ ₱
                {selectedRoom.hourly_rate}/hr
              </p>
              <p>
                <strong>Bed:</strong> {selectedBed.number}
              </p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.proceedBtn} onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
