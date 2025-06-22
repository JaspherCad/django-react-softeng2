import React from "react";
import styles from "./PatientHistoryView.module.css";

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
};

const PatientHistoryModal = ({ note }) => {
    if (!note) return <div className={styles.message}>No record selected.</div>;

    return (
        <div className={styles.historyContainer}>
            <h2>Patient History Details (Case #{note.case_number})</h2>
            <div className={styles.detailsGrid}>
                <div><strong>Name:</strong> {note.name}</div>
                <div><strong>Status:</strong> {note.status}</div>
                <div><strong>Hospital Case #:</strong> {note.hospital_case_number}</div>
                <div><strong>Admission Date:</strong> {formatDate(note.admission_date)}</div>
                <div><strong>Discharge Date:</strong> {formatDate(note.discharge_date)}</div>
                <div><strong>Date of Birth:</strong> {formatDate(note.date_of_birth)}</div>
                <div><strong>Consultation:</strong> {formatDate(note.consultation_datetime)}</div>
                <div><strong>Next Consultation:</strong> {formatDate(note.next_consultation_date)}</div>
                <div><strong>Address:</strong> {note.address}</div>
                <div><strong>Phone:</strong> {note.phone}</div>
                <div><strong>Emergency Contact:</strong> {note.emergency_contact_name} ({note.emergency_contact_phone})</div>
                <div><strong>Height:</strong> {note.height} cm</div>
                <div><strong>Weight:</strong> {note.weight} kg</div>
                <div><strong>BP:</strong> {note.blood_pressure}</div>
                <div><strong>Pulse:</strong> {note.pulse_rate}</div>
                <div><strong>Respiratory Rate:</strong> {note.respiratory_rate}</div>
                <div><strong>Temperature:</strong> {note.temperature}</div>
                <div><strong>Occupation:</strong> {note.occupation}</div>
                <div><strong>Nationality:</strong> {note.nationality}</div>
                <div><strong>Religion:</strong> {note.religion}</div>
                <div><strong>Civil Status:</strong> {note.civil_status}</div>
                <div><strong>Visit Type:</strong> {note.visit_type}</div>
                <div><strong>Main Complaint:</strong> {note.main_complaint}</div>
                <div><strong>Present Illness:</strong> {note.present_illness}</div>
                <div><strong>Clinical Findings:</strong> {note.clinical_findings}</div>
                <div><strong>Diagnosis:</strong> {note.diagnosis}</div>
                <div><strong>ICD Code:</strong> {note.icd_code}</div>
                <div><strong>Treatment:</strong> {note.treatment}</div>
                <div><strong>Notes:</strong> {note.notes}</div>
                <button
                    className={styles.viewBtn}
                    onClick={() => handleView(note)}
                >
                    VIEW
                </button>
            </div>
        </div>
    );
};

export default PatientHistoryModal;
