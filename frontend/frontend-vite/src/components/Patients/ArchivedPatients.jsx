// #{ "id": 42, "unarchive": true }
//     path('patients/archived/', views.archived_patients, name='archived-patient-list'),

import { archivedPatients, unarchivePatient } from "../../api/axios";
import styles from './Patients.module.css';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Common/Pagination';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useEffect, useState } from "react";


// @api_view(['GET', 'POST'])
// @permission_classes([IsAdmin])
// def archived_patients(request):
//     if request.method == 'POST':
//         patient_id = request.data.get('id')
//         unarchive_flag = request.data.get('unarchive', False)

//         if not patient_id:
//             return Response(
//                 {"detail": "Missing patient 'id' in request."},
//                 status=status.HTTP_400_BAD_REQUEST
//             )

//         try:
//             patient = Patient.objects.get(pk=patient_id, archived=True)
//         except Patient.DoesNotExist:
//             return Response(
//                 {"detail": "Archived patient not found."},
//                 status=status.HTTP_404_NOT_FOUND
//             )

//         if unarchive_flag:
//             patient.unarchive()  
//             serializer = PatientSerializer(patient)
//             return Response(serializer.data, status=status.HTTP_200_OK)
//         else:
//             return Response(
//                 {"detail": "`unarchive` flag must be true to unarchive."},
//                 status=status.HTTP_400_BAD_REQUEST
//             )

//     # GET: 
//     try:
//         qs = Patient.objects.filter(is_active='Active', archived=True).order_by('-admission_date')

//         paginator = PageNumberPagination()
//         paginator.page_size = 10  

//         page = paginator.paginate_queryset(qs, request)
//         if page is not None:
//             ser = PatientSerializer(page, many=True)
//             return paginator.get_paginated_response(ser.data)

//         ser = PatientSerializer(qs, many=True)
//         return Response(ser.data, status=status.HTTP_200_OK)

//     except Exception as e:
//         return Response(
//             {"error": "Error fetching archived patients", "details": str(e)},
//             status=status.HTTP_500_INTERNAL_SERVER_ERROR
//         )

const PAGE_SIZE = 10; 

const ArchivedPatients = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Modal state
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchArchivedPatients = async (page) => {
    try {
      setLoading(true);
      const response = await archivedPatients(page);
      setPatients(response.data.results);
      setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
      setTotalItems(response.data.count);
      setError(null);
    } catch (err) {
      setError('Failed to fetch archived patients');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedPatients(currentPage);
  }, [currentPage]);

  const handleUnarchive = (patient) => {
    setSelectedPatient(patient);
    setShowUnarchiveModal(true);
  };

  const confirmUnarchive = async () => {
    if (selectedPatient) {
      try {
        await unarchivePatient(selectedPatient.id);
        setShowUnarchiveModal(false);
        setSelectedPatient(null);
        //refresh
        fetchArchivedPatients(currentPage);
      } catch (error) {
        console.error('Error unarchiving patient:', error);
        setError('Failed to unarchive patient');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!user || user.role !== 'Admin') {
    return <div className={styles.error}>Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Loading archived patients...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.patientManagement}>
      <div className={styles.container}>
        <div className={styles.tableContent}>
          <div className={styles.headerRow}>
            <h2>Archived Patients</h2>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th>Case Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients && patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id} className={styles.tableRow}>
                    <td data-label="Patient Id">{patient.code}</td>
                    <td data-label="Name">{patient.name}</td>
                    <td data-label="Admission_Date">{patient.admission_date}</td>
                    <td data-label="Status">{patient.status}</td>
                    <td data-label="case_number">{patient.case_number}</td>
                    <td data-label="Action">
                      <button
                        className={styles.btnUnarchive}
                        onClick={() => handleUnarchive(patient)}
                      >
                        <i className="fa fa-undo"></i> Unarchive
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No archived patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={PAGE_SIZE}
            onPageChange={handlePageChange}
            itemName="archived patients"
            showInfo={true}
            showPageNumbers={true}
            maxVisiblePages={5}
          />
        </div>
      </div>




      {/* Unarchive Confirmation Modal */}
      {showUnarchiveModal && selectedPatient && (
        <div className={styles.modalOverlay} onClick={() => setShowUnarchiveModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Unarchive Patient</h2>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowUnarchiveModal(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.archiveConfirmation}>
                <p>Are you sure you want to unarchive the following patient?</p>
                <div className={styles.patientInfo}>
                  <strong>Patient ID:</strong> {selectedPatient.code}<br />
                  <strong>Name:</strong> {selectedPatient.name}<br />
                  <strong>Admission Date:</strong> {selectedPatient.admission_date}
                </div>
                <p className={styles.warningText}>
                  This action will restore the patient to the active patient list.
                </p>
                <div className={styles.modalActions}>
                  <button 
                    className={styles.btnCancel} 
                    onClick={() => setShowUnarchiveModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.btnConfirmUnarchive} 
                    onClick={confirmUnarchive}
                  >
                    Unarchive Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedPatients;


