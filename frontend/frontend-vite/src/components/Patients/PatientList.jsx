import React, { useContext, useState } from 'react';
import styles from './Patients.module.css';
import { useNavigate, useParams } from 'react-router-dom'
import { archiveOrUnarchivePatient, listOfPatientAPI, SearchPatientsApi } from '../../api/axios';
import SearchBar from '../AngAtingSeachBarWIthDropDown';
import Pagination from '../Common/Pagination';
import { AuthContext } from '../../context/AuthContext';
import ArchivedPatients from './ArchivedPatients';
import ModalOverview from './ModalOverview';

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
  setPatients,
  onPageChange,
  setTotalItems,
  setTotalPages,

  PAGE_SIZE }) => {

  const navigate = useNavigate()
  // const [selectedPatient, setSelectedPatient] = useState(null); //move to upper state so we can reuse for edit, specific views, etc







  const { user, logout } = useContext(AuthContext);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitStep, setAdmitStep] = useState(null); // 'existing' or 'new'
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [patientToArchive, setPatientToArchive] = useState(null);
  const [showArchivesModal, setShowArchivesModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState(''); //required for SearchBar
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar
  const [selectedExisting, setSelectedExisting] = useState(null);



  const [seletecExistingPatient, setSeletecExistingPatient] = useState(null); // 'existing' or 'new'




  console.log(patients)
  const handleRowClick = (patient) => {
    setSelectedPatient(patient); //send this info to parent
    setShowDetailsModal(true);
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
    navigate(`/patients/existing/${patient.id}`);
  }

  const handleArchive = (patient) => {
    setPatientToArchive(patient);
    setShowArchiveModal(true);

  };



  const confirmArchive = async () => {
    if (patientToArchive) {
      try {
        const response = await archiveOrUnarchivePatient(patientToArchive.id, true);
        if (response.status === 200) {
          setShowArchiveModal(false);
          setPatientToArchive(null);
          const response = await listOfPatientAPI(currentPage);

          setPatients(response.data.results || []);
          setTotalItems(response.data.count || 0);
          setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));


          if (onPageChange) {
            onPageChange(currentPage); // Refresh the current page
          }
        }
      } catch (error) {
        console.error('Error archiving patient:', error);
        // You might want to show an error message to the user here
        // For example: setError('Failed to archive patient. Please try again.');
      }
    }
  };

  const closeArchiveModal = () => {
    setShowArchiveModal(false);
    setPatientToArchive(null);
  };

  const handleShowArchives = () => {
    setShowArchivesModal(true);
  };

  const closeArchivesModal = () => {
    setShowArchivesModal(false);
  };

  return (
    <div className={styles.patientManagement}>
      <div className={styles.container}>
        <div className={styles.tableContent}>
          <div className={styles.headerRow}>
            <h2>Patient Records</h2>
            {user.role === 'Admin' && (
              <button
                className={styles.btnViewArchives}
                onClick={handleShowArchives}
              >
                <i className="fa fa-archive"></i> View Archives
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className={styles.searchSection}>
            <SearchBar
              placeholder="🔍Search patients"
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
            {user.role !== 'Doctor' && user.role !== 'Nurse' && (
              <button className={styles.btnAddNewPatient} onClick={handleAdmitClick}>
                Admit New Patient
              </button>
            )}
          </div>


          {/* Table */}
          <div className={styles.tableContent}>

            {user.role === 'Admin' ?
              (<>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Admission</th>
                      <th>Status</th>
                      <th>case_number</th>
                      <th >Action</th>
                      <th>Archive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients && patients.length > 0 ?
                      patients.map((patient, index) => (
                        <tr
                          key={index}
                          className={styles.tableRow}
                        >
                          <td data-label="Patient Id">{patient.code}</td>
                          <td data-label="Name">{patient.name}</td>
                          <td data-label="Admission_Date">{new Date(patient.admission_date).toLocaleDateString()}</td>
                          <td data-label="Status">
                            <span className={
                              patient.status === 'Admitted' ? 'bg-green-500 text-black px-2 py-1 rounded-full text-xs' :
                              patient.status === 'Discharged' ? 'bg-blue-500 text-black px-2 py-1 rounded-full text-xs' :
                              'bg-yellow-500 text-white px-2 py-1 rounded-full text-xs'
                            }>
                              {patient.status}
                            </span>
                          </td>
                          <td data-label="case_number">{patient.case_number}</td>

                          <td data-label="View">
                            <button
                              className={styles.btnView}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRowClick(patient)
                              }}
                              aria-label="View patient details"
                            >
                              <i className="fa fa-eye"></i> View
                            </button>
                          </td>

                          <td data-label="Delete">
                            <button
                              className={styles.btnArchive}
                              onClick={e => {
                                e.stopPropagation();
                                handleArchive(patient);
                              }}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))
                      :
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>
                          No patients found
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </>)
              :
              (
                <>
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
                      {patients && patients.length > 0 ?
                        patients.map((patient, index) => (
                          <tr
                            key={index}
                            className={styles.tableRow}
                          >
                            <td data-label="Patient Id">{patient.code}</td>
                            <td data-label="Name">{patient.name}</td>
                            <td data-label="Admission_Date">{new Date(patient.admission_date).toLocaleDateString()}</td>
                            <td data-label="Status">
                              <span className={
                                patient.status === 'Admitted' ? 'bg-green-500 text-white px-2 py-1 rounded-full text-xs' :
                                patient.status === 'Discharged' ? 'bg-blue-500 text-white px-2 py-1 rounded-full text-xs' :
                                'bg-yellow-500 text-white px-2 py-1 rounded-full text-xs'
                              }>
                                {patient.status}
                              </span>
                            </td>
                            <td data-label="case_number">{patient.case_number}</td>

                            <td data-label="View">
                              <button
                                className={styles.btnView}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRowClick(patient)
                                }}
                                aria-label="View patient details"
                              >
                                <i className="fa fa-eye"></i> View
                              </button>
                            </td>
                          </tr>
                        ))
                        :
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center' }}>
                            No patients found
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </>
              )
            }










          </div>
        </div>






        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={PAGE_SIZE}
          onPageChange={onPageChange}
          itemName="patients"
          showInfo={true}
          showPageNumbers={true}
          maxVisiblePages={5}
        />
      </div>

      {/* Patient Details Modal - Using ModalOverview component */}
      {showDetailsModal && selectedPatient && (
        <ModalOverview 
          patient={selectedPatient} 
          onClose={closeDetailsModal}
        />
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
                        ? `inpatient/existing/${seletecExistingPatient.id}`
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
                        ? `outpatient/existing/${seletecExistingPatient.id}`
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

      {/* Archive Confirmation Modal */}
      {showArchiveModal && patientToArchive && (
        <div className={styles.modalOverlay} onClick={closeArchiveModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Archive Patient</h2>
              <button className={styles.closeButton} onClick={closeArchiveModal}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.archiveConfirmation}>
                <p>Are you sure you want to archive the following patient?</p>
                <div className={styles.patientInfo}>
                  <strong>Patient ID:</strong> {patientToArchive.code}<br />
                  <strong>Name:</strong> {patientToArchive.name}<br />
                  <strong>Admission Date:</strong> {patientToArchive.admission_date}
                </div>
                <p className={styles.warningText}>
                  This action will move the patient to the archive. The patient record will no longer be visible in the active patient list.
                </p>
                <div className={styles.modalActions}>
                  <button className={styles.btnCancel} onClick={closeArchiveModal}>
                    Cancel
                  </button>
                  <button className={styles.btnConfirmArchive} onClick={confirmArchive}>
                    Archive Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Archives Modal */}
      {showArchivesModal && (
        <div className={styles.modalOverlay} onClick={closeArchivesModal}>
          <div className={`${styles.modal} ${styles.archivesModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Archived Patients</h2>
              <button className={styles.closeButton} onClick={closeArchivesModal}>&times;</button>
            </div>
            <div className={styles.modalContent}>
              <ArchivedPatients onClose={closeArchivesModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default PatientList;