import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchClinicalNotesByCodeAPI, createClinicalNoteAPI, fetchPatientHistoryByIdAPI, SearchLaboratoryApi } from "../../api/axios";
import styles from "./PatientHistoryCaseCode.module.css";
import PatientDataView from "./PatientDataView";
import PatientHistoryModal from "./PatientHistoryModal";

const NOTE_TYPES = ["All", "Doctor", "Nurse", "General", "Medication", "Laboratories"];

export default function PatientHistoryCaseCode() {
    const { patientid, caseCode, historyid } = useParams();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("Doctor");

    const [patientInformation, setPatientInformation] = useState();

    const navigate = useNavigate();




    //MODAL STATEAS
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        author: 1,
        note_type: "",
        note_date: new Date().toISOString().slice(0, 16),
        focus_problem: "",
        progress_notes: "",
        orders: "",
        content: "",
        medication: "",
        dose_frequency: "",

        //nurse notes specifically for DAT
        data: "",
        action: "",
        response: ""

    });


    const [formError, setFormError] = useState("");






    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await fetchClinicalNotesByCodeAPI(caseCode);
                const resultsPatientInfoABoutThatCode = await fetchPatientHistoryByIdAPI(patientid, historyid);
                console.log(resultsPatientInfoABoutThatCode.data)
                setPatientInformation(resultsPatientInfoABoutThatCode.data)
                setNotes(data);
                console.log(data)
            } catch {
                setError("Failed to load notes for this case code");
            } finally {
                setLoading(false);
            }
        })();
    }, [caseCode, historyid]);

    /* ───────── memo-ised filtering ───────── */
    const filteredNotes = useMemo(
        () =>
            filter === "All"
                ? notes
                : notes.filter((n) => n.note_type === filter),
        [filter, notes]
    );






    //SUBMIT FORM 
    const handleSubmit = async (e) => {
        e.preventDefault();

        //basecase validation
        if (!formData.note_type || !formData.note_date) {
            setFormError("Note type and date are required");
            return;
        }

        // nurse validation
        if (formData.note_type === "Nurse" && (!formData.data || !formData.action || !formData.response)) {
            setFormError("Data, Action, and Response are required for Nurse notes");
            return;
        }

        try {
            // Add case_number to payload
            const payload = {
                ...formData,
                case_number: caseCode
            };

            if (formData.note_type === "Nurse") {
                payload.progress_notes = `Data: ${payload.data}\nAction: ${payload.action}\nResponse: ${payload.response}`;

            }

            const response = await createClinicalNoteAPI(patientid, caseCode, payload);

            setNotes(prev => [...prev, response.data]);

            // Reset form and close modal
            setFormData({
                author: 1,
                note_type: "",
                note_date: new Date().toISOString().slice(0, 16),
                focus_problem: "",
                progress_notes: "",
                orders: "",
                content: "",
                medication: "",
                dose_frequency: ""
            });
            setIsModalOpen(false);
            setFormError("");
        } catch (err) {
            setFormError("Failed to create note");
            console.error(err);
        }
    };

    const handleLabRedirect = async () => {
        try {
            // Search for labs using patient name or code
            const searchTerm = patientInformation?.code || patientInformation?.name || '';
            if (!searchTerm) {
                // If no patient info available, go to general lab page
                window.location.href = 'http://192.168.2.117:3000/laboratory';
                return;
            }

            const response = await SearchLaboratoryApi(searchTerm);

            // Check if patient has any lab records
            if (response.data && response.data.length > 0) {
                // Patient has lab records, redirect to first lab record
                const firstLab = response.data[0];
                navigate(`/laboratory/labId/${firstLab.id}`);
            } else {
                // No lab records found, redirect to general laboratory page with patient code prefilled
                const patientCode = patientInformation?.code || patientInformation?.name || '';
                if (patientCode) {
                    window.location.href = `http://192.168.2.117:3000/laboratory?q=${encodeURIComponent(patientCode)}`;
                } else {
                    window.location.href = 'http://192.168.2.117:3000/laboratory';
                }
            }
        } catch (error) {
            console.error('Error checking lab records:', error);
            // On error, default to general laboratory page with patient code if available
            const patientCode = patientInformation?.code || patientInformation?.name || '';
            if (patientCode) {
                window.location.href = `http://192.168.2.117:3000/laboratory?q=${encodeURIComponent(patientCode)}`;
            } else {
                window.location.href = 'http://192.168.2.117:3000/laboratory';
            }
        }
    };

    if (loading) return <div className={styles.loading}>Loading…</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <>
            <div className={styles.patientManagement}>
                <h2>Notes for Cases “{caseCode}”</h2>

                {/* Create Button */}
                <div className={styles.headerActions}>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Note
                    </button>
                </div>



                {/* Toggle bar */}
                <div className={styles.toggleBar}>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}

                        required
                    >
                        <option value="">Select type</option>
                        {NOTE_TYPES.filter(type => type !== "All")
                            .map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                    </select>



                </div>


                {/* GENERAL HISTORY MODAL */}
                {filter === "General" && patientInformation && (

                    <PatientDataView patientData={patientInformation} />

                )}

                {/* GENERAL HISTORY MODAL */}
                {/* GENERAL HISTORY MODAL */}
                {filter === "Laboratories" && (
                    <>
                        <div className={styles.labRedirect}>
                            <button
                                className={styles.secondaryBtn}
                                onClick={() => handleLabRedirect()}
                            >
                                Go to Laboratory Tab
                            </button>
                        </div>
                    </>
                )}


                {/* Notes list */}
                {filteredNotes.length === 0 ? (
                    <p>No {filter === "All" ? "" : filter.toLowerCase() + " "}notes found.</p>
                ) : (
                    filteredNotes.map((note) => (
                        <div key={note.id} className={styles.historyCard}>
                            <div className={styles.noteHeader}>
                                <span
                                    className={`${styles.noteTypeBadge} ${styles["badge" + note.note_type]
                                        }`}
                                >
                                    {note.note_type}
                                </span>
                                <span className={styles.noteDate}>
                                    {new Date(note.note_date).toLocaleString()}
                                </span>
                            </div>

                            <p>
                                <strong>By:</strong> {note.author + " thats id, ADD BACKEND NAMES FOR AUTHOR! serializer clue" || "—"}
                            </p>
                            <hr />

                            {formData.note_type === "Nurse" && (<p>
                                <strong>Focus Problem:</strong> {note.focus_problem || "—"}
                            </p>)}

                            <p>
                                <strong>Progress Notes:</strong> {note.progress_notes || "—"}
                            </p>
                            {formData.note_type === "Doctor" && (<p>
                                <strong>Orders:</strong> {note.orders || "—"}
                            </p>)}

                            {note.medication && (
                                <p>
                                    <strong>Medication:</strong> {note.medication} (
                                    {note.dose_frequency})
                                </p>
                            )}

                        </div>
                    ))
                )}
            </div>




            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Create New Note</h3>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>

                        {formError && <div className={styles.formError}>{formError}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Type</label>
                                <select
                                    value={formData.note_type}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        note_type: e.target.value
                                    })}
                                    required
                                >
                                    <option value="">Select type</option>
                                    {NOTE_TYPES.filter(type => type !== "All" && type !== "General")
                                        .map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                </select>
                            </div>




                            {formData.note_type === "Doctor" && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label>Date</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.note_date}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                note_date: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Progress Notes</label>
                                        <textarea
                                            value={formData.progress_notes}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                progress_notes: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Orders</label>
                                        <textarea
                                            value={formData.orders}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                orders: e.target.value
                                            })}
                                        />
                                    </div>
                                </>
                            )}


                            {formData.note_type === "Nurse" && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label>Date</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.note_date}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                note_date: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Focus Problem</label>
                                        <input
                                            type="text"
                                            value={formData.focus_problem}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                focus_problem: e.target.value
                                            })}
                                        />
                                    </div>

                                    {/* <div className={styles.formGroup}>
                                        <label>Progress Notes</label>
                                        <textarea
                                            value={formData.progress_notes}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                progress_notes: e.target.value
                                            })}
                                        />
                                    </div> */}
                                    <div className={styles.formGroup}>
                                        <label>Data</label>
                                        <input
                                            type="text"
                                            value={formData.data}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                data: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Action</label>
                                        <input
                                            type="text"
                                            value={formData.action}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                action: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Response</label>
                                        <input
                                            type="text"
                                            value={formData.response}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                response: e.target.value
                                            })}
                                        />
                                    </div>
                                </>
                            )}


                            {/* Medication fields - only show for Medication notes */}
                            {formData.note_type === "Medication" && (
                                <>

                                    <div className={styles.formGroup}>
                                        <label>Date</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.note_date}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                note_date: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Medication</label>
                                        <input
                                            type="text"
                                            value={formData.medication}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                medication: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Dose/Frequency</label>
                                        <input
                                            type="text"
                                            value={formData.dose_frequency}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                dose_frequency: e.target.value
                                            })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.secondaryBtn}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primaryBtn}>
                                    Create Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>

    );
}