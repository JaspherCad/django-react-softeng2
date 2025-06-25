import React, { useState } from 'react';
import styles from './Patients.module.css';
import { useNavigate, useParams } from 'react-router-dom'
import { SearchPatientsApi } from '../../api/axios';
import SearchBar from '../AngAtingSeachBarWIthDropDown';
//EACH PATIENT PER .MAP() has this
//     name: '',
//     date_of_birth: '',
//     address: '',
//     admission_date: '',
//     discharge_date: '',
//     status: 'Admitted',
//     current_condition: '',
//     phone: '',
//     email: '',
//     emergency_contact_name: '',
//     emergency_contact_phone: '',
//     is_active: 'Active'


const PatientList = ({
  patients,
  selectedPatient,
  setSelectedPatient,
  loading,
  errorMsg,
  //pagination props
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  PAGE_SIZE }) => {

  const navigate = useNavigate()
  // const [selectedPatient, setSelectedPatient] = useState(null); //move to upper state so we can reuse for edit, specific views, etc








  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitStep, setAdmitStep] = useState(null); // 'existing' or 'new'

  const [searchTerm, setSearchTerm] = useState(''); //required for SearchBar
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar
  const [selectedExisting, setSelectedExisting] = useState(null);



  const [seletecExistingPatient, setSeletecExistingPatient] = useState(null); // 'existing' or 'new'




  console.log(patients)
  const handleRowClick = (patient) => {
    setSelectedPatient(patient); //send this info to parent
    setShowDetailsModal(true);
  };


  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading patients...</div>;
  }

  if (errorMsg) {
    return <div className={styles.error}>{errorMsg}</div>;
  }

  const handleAdmitClick = () => {
    setAdmitStep(null);
    setShowAdmitModal(true);
  };

  const choosePatientType = (type) => {
    setAdmitStep(type);
  };

  const navigateForm = (formType) => {
    // formType: 'inpatient' or 'outpatient'
    // for existing vs new, you might pass patient id or not
    console.log(`navigating to ${formType}`)
    navigate('#');
  };


  const closeAdmitModal = () => {
    setShowAdmitModal(false);
    setAdmitStep(null);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPatient(null);
  };

  const handleSelectedItem = (selectedPatient) => {
    console.log(selectedPatient.id)
    setSearchTerm(selectedPatient.code)
    setSeletecExistingPatient(selectedPatient)
    setIsDropdownVisible(false)
  }


  const handleEditClick = (patient, e) => {
    e.stopPropagation(); // Prevent row click when clicking button
    setSelectedPatient(patient);
    navigate(`/patients/edit/${patient.id}`);
  }

  return (
    <div className={styles.patientManagement}>
      <div className={styles.container}>
        <div className={styles.tableContent}>
          <div className={styles.headerRow}>
            <h2>Patient Recordzs</h2>
            <button className={styles.btnPrimary} onClick={handleAdmitClick}>
              Admit New Patient
            </button>
          </div>

          {/* Search bar */}
          <div className={styles.searchSection}>
            <SearchBar
              placeholder="Search patients"
              searchApi={SearchPatientsApi}
              onSelectSuggestion={item => {
                setSearchTerm(item.code);
                setSelectedExisting(item);
                setIsDropdownVisible(false);
                console.log(item.id)
                navigate(`/patients/history/${item.id}`);
              }}
              suggestedOutput={['code', 'name']}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
              maxDropdownHeight="500px"
            />
          </div>


          {/* Table */}
          <div className={styles.tableContent}>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Admission</th>
                  <th>Status</th>
                  <th>case_number</th>
                  <th colSpan="2">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients && patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <tr
                      key={index}
                      
                      className={styles.tableRow}
                    >
                      <td data-label="Patient Id">{patient.code}</td>
                      <td data-label="Name">{patient.name}</td>
                      <td data-label="Admission_Date">{patient.admission_date}</td>
                      <td data-label="Status">{patient.status}</td>
                      <td data-label="case_number">{patient.case_number}</td>

                      <td data-label="View">
                        <button
                          className={styles.btnView}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(patient)
                          }} // STOPS row click when clicking button
                        >
                          <i className="fa fa-eye"></i>View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>






        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems} patients
            </div>

            <div className={styles.paginationControls}>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>

              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {/* WHERE SELECTED PATIENT FROM?????? the PARENT.. CRUD AND ALL UTILITY IS OVER THER>>> */}
      {showDetailsModal && selectedPatient && (
        <div className={styles.modalOverlay} onClick={closeDetailsModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Patient Details</h2>
              <button className={styles.closeButton} onClick={closeDetailsModal}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.patientDetail}>
                <strong>Name:</strong> {selectedPatient.name}
              </div>
              <div className={styles.patientDetail}>
                <strong>Date of Birth:</strong> {selectedPatient.date_of_birth}
              </div>
              <div className={styles.patientDetail}>
                <strong>Address:</strong> {selectedPatient.address}
              </div>
              <div className={styles.patientDetail}>
                <strong>Admission Date:</strong> {selectedPatient.admission_date}
              </div>
              <div className={styles.patientDetail}>
                <strong>Discharge Date:</strong> {selectedPatient.discharge_date || 'N/A'}
              </div>
              <div className={styles.patientDetail}>
                <strong>Status:</strong> {selectedPatient.status}
              </div>
              <div className={styles.patientDetail}>
                <strong>Current Condition:</strong> {selectedPatient.current_condition}
              </div>
              <div className={styles.patientDetail}>
                <strong>Phone:</strong> {selectedPatient.phone}
              </div>
              <div className={styles.patientDetail}>
                <strong>Email:</strong> {selectedPatient.email}
              </div>
              <div className={styles.patientDetail}>
                <strong>Emergency Contact:</strong> {selectedPatient.emergency_contact_name}
              </div>
              <div className={styles.patientDetail}>
                <strong>Emergency Phone:</strong> {selectedPatient.emergency_contact_phone}
              </div>
              <div className={styles.patientDetail}>
                <strong>Active Status:</strong> {selectedPatient.is_active}
              </div>


              <div className={styles.patientDetail}>
                <strong>VIEW MEDICAL HISTORY</strong>
                <button
                  className={styles.historyBtn}
                  onClick={() => navigate(`/patients/history/${selectedPatient.id}`)}
                >
                  VIEW&nbsp;MEDICAL&nbsp;HISTORY
                </button>

              </div>

            </div>
          </div>
        </div>
      )}




      {/* Admit Modal: Step 1 choose existing/new, Step 2 choose form and (if existing) search patient */}
      {showAdmitModal && (
        <div className={styles.modalOverlay} onClick={closeAdmitModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Admit Patient</h2>
              <button className={styles.closeButton} onClick={closeAdmitModal}>&times;</button>
            </div>





            
            <div className={styles.modalContent}>





              {!admitStep ? (
                <>
                  <button className={styles.btnOption} onClick={() => choosePatientType('existing')}>
                    Existing Patient
                  </button>
                  <button className={styles.btnOption} onClick={() => choosePatientType('new')}>
                    New Patient
                  </button>
                </>
              ) : (
                <>
                  {admitStep === 'existing' && (
                    <SearchBar
                      // data={dummyBillingData}
                      placeholder={"IDKsss"}
                      searchApi={SearchPatientsApi}
                      // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
                      //to accept *-*
                      onSelectSuggestion={(filtered) => handleSelectedItem(filtered)}
                      suggestedOutput={['code', 'name']}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      isDropdownVisible={isDropdownVisible}
                      setIsDropdownVisible={setIsDropdownVisible}
                      maxDropdownHeight="500px"

                    />
                  )}




                  <p>Choose form type:</p>
                  <button
                    className={styles.btnOption}
                    onClick={() => {
                      const url = admitStep === 'existing'
                        ? `inpatient/edit/${seletecExistingPatient.id}`
                        : `inpatient/add`
                      navigate(url);
                      closeAdmitModal();
                    }}
                  >
                    Inpatient
                  </button>


                  <button
                    className={styles.btnOption}
                    onClick={() => {
                      const url = admitStep === 'existing'
                        ? `outpatient/edit/${seletecExistingPatient.id}`
                        : `outpatient/add`;
                      navigate(url);
                      closeAdmitModal();
                    }}
                  >
                    Outpatient
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default PatientList; 