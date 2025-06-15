// src/pages/BedAssignments/BedAssignmentList.jsx
import React, { useEffect, useState } from 'react'
import styles from './BedAssignmentList.module.css'
import { fetchBedAssignments, fetchServerTime } from '../../api/axios'
import { useNavigate } from 'react-router-dom'
export default function BedAssignmentList() {
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeOnly, setActiveOnly] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [serverTime, setServerTime] = useState(new Date())
    const navigate = useNavigate()
    //ALWAYS FETCH the first ticktock then let frotnend do the rest after init.
    useEffect(() => {
        fetchServerTime()
            .then(res => setServerTime(new Date(res.data.server_time)))
            .catch(() => { }) // fallback to client time
    }, [])

    //tkcotock clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setServerTime(prev => new Date(prev.getTime() + 1000))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Load assignments whenever activeOnly changes
    useEffect(() => {
        setLoading(true)
        setError(null)
        fetchBedAssignments(activeOnly)
            .then(data => {
                setAssignments(data)
                console.log(data)
            })
            .catch(() => setError('Failed to load assignments'))
            .finally(() => setLoading(false))
    }, [activeOnly])

    //   const filtered = assignments.filter(a => {
    //     const patientName = a.patient.name.toLowerCase()
    //     const billingId   = String(a.billing).toLowerCase()
    //     const term = searchTerm.toLowerCase()
    //     return patientName.includes(term) || billingId.includes(term)
    //   })

    if (loading) return <p className={styles.loading}>Loading…</p>
    if (error) return <p className={styles.error}>{error}</p>

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h2>Bed Assignments</h2>
                <div>
                    <button
                        className={styles.addBtn}
                        onClick={() => navigate('add-bed')}
                    >
                        + Add New Assignment
                    </button>
                </div>
                <div className={styles.clock}>
                    Server time: {serverTime.toLocaleString()}
                </div>
            </header>

            <div className={styles.controls}>
                <label>
                    <input
                        type="checkbox"
                        checked={activeOnly}
                        onChange={e => setActiveOnly(e.target.checked)}
                    />{' '}
                    Show active only
                </label>
                <input
                    type="text"
                    placeholder="Search by patient or billing ID…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Room</th>
                            <th>Bed#</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Total Hrs</th>
                            <th>Billing ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(a => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.patient.name}</td>
                                <td>{a.bed.room.name}</td>
                                <td>{a.bed.number}</td>
                                <td>{new Date(a.start_time).toLocaleString()}</td>
                                <td>
                                    {a.end_time
                                        ? new Date(a.end_time).toLocaleString()
                                        : '—'}
                                </td>
                                <td>{a.total_hours}</td>
                                <td>{a.billing || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
