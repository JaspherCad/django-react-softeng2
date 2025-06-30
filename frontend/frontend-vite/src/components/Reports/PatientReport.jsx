import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getPatientReportAPI, SearchPatientsApi } from '../../api/axios';
import styles from './reports.module.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PatientHistory from '../Patients/PatientHistory';
import SearchBar from '../AngAtingSeachBarWIthDropDown';

const PatientReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();



  const isMedicalHistory = location.pathname.endsWith('/medicalHistory');
  console.log('isMedicalHistory:', isMedicalHistory);
  //if isMedicalHistory dont show date filter and buttons.

  



  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState();

  const today = new Date();
  const isoToday = today.toISOString().split('T')[0];
  const isoStartOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(isoStartOfYear);
  const [endDate, setEndDate] = useState(isoToday);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [searchTerm, setSearchTerm] = useState(''); //required for SearchBar
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar



  const tableRef = useRef();

  const fetchPatients = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const response = await getPatientReportAPI(startDate, endDate, currentPage, itemsPerPage);
      setPatients(response.data.results);
      console.log(response.data.results);

      setTotalItems(response.data.count);
      setTotalPages(Math.ceil(response.data.count / itemsPerPage));
    } catch (error) {
      console.error('Failed fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [startDate, endDate, currentPage, itemsPerPage]);


  const handleGeneratePdf = () => {
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    const columns = [
      { header: 'Patient ID', dataKey: 'code' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Admission Date', dataKey: 'admission_date' },
      { header: 'Bed Number', dataKey: 'bed_number' },
      { header: 'Case Number', dataKey: 'case_number' },
      { header: 'Hospital Case Number', dataKey: 'hospital_case_number' },
      { header: 'Gender', dataKey: 'gender' },
      { header: 'Age', dataKey: 'age' },

      { header: 'Ward Service', dataKey: 'ward_service' },
      { header: 'Type of Admission', dataKey: 'type_of_admission' },
      { header: 'Visit Type', dataKey: 'visit_type' },
      { header: 'Consultation Datetime', dataKey: 'consultation_datetime' },

      { header: 'Next Consultation Date', dataKey: 'next_consultation_date' },
      { header: 'Discharge Date', dataKey: 'discharge_date' },
      { header: 'Total Days', dataKey: 'total_days' },

      { header: 'ICD Code', dataKey: 'icd_code' },


      { header: 'Attending Physician', dataKey: 'attending_physician' },

    ];

    const rows = patients.map(patient => ({
      ...patient,
      admission_date: patient.admission_date
        ? new Date(patient.admission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '',
      attending_physician: patient.attending_physician ? `Dr. ${patient.attending_physician}` : 'N/A',
    }));

    autoTable(pdf, {
      columns,
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 40 },
    });

    pdf.save(`patient-report_${startDate}_${endDate}.pdf`);
  };

  const handleGenerateCsv = () => {
    const headers = [
      'Patient ID', 'Name', 'Status', 'Case Number', 'Hospital Case Number',
      'Gender', 'Age', 'Birth Place', 'Date of Birth', 'Civil Status',
      'Nationality', 'Religion', 'Address', 'Phone', 'Occupation',
      'Ward Service', 'Bed Number', 'Type of Admission', 'Visit Type',
      'Admission Date', 'Discharge Date', 'Total Days',
      'Current Condition', 'Main Complaint', 'Present Illness',
      'Clinical Findings', 'Diagnosis', 'Treatment',
      'Height', 'Weight', 'Blood Pressure', 'Temperature',
      'Pulse Rate', 'Respiratory Rate',
      'Attending Physician', 'PhilHealth Member', 'HMO Member', 'HMO Provider',
      'Emergency Contact', 'Emergency Phone',
      'Entry Date', 'Notes'
    ].join(',');

    const csvRows = patients.map(p => {
      const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US') : 'N/A';
      const escapeCommas = (str) => str ? `"${str.replace(/"/g, '""')}"` : 'N/A';

      return [
        escapeCommas(p.code),
        escapeCommas(p.name),
        escapeCommas(p.status),
        escapeCommas(p.case_number),
        escapeCommas(p.hospital_case_number),
        escapeCommas(p.gender),
        p.age || 'N/A',
        escapeCommas(p.birth_place),
        formatDate(p.date_of_birth),
        escapeCommas(p.civil_status),
        escapeCommas(p.nationality),
        escapeCommas(p.religion),
        escapeCommas(p.address),
        escapeCommas(p.phone),
        escapeCommas(p.occupation),
        escapeCommas(p.ward_service),
        escapeCommas(p.bed_number),
        escapeCommas(p.type_of_admission),
        escapeCommas(p.visit_type),
        formatDate(p.admission_date),
        formatDate(p.discharge_date),
        p.total_days || 'N/A',
        escapeCommas(p.current_condition),
        escapeCommas(p.main_complaint),
        escapeCommas(p.present_illness),
        escapeCommas(p.clinical_findings),
        escapeCommas(p.diagnosis),
        escapeCommas(p.treatment),
        p.height || 'N/A',
        p.weight || 'N/A',
        escapeCommas(p.blood_pressure),
        p.temperature || 'N/A',
        p.pulse_rate || 'N/A',
        p.respiratory_rate || 'N/A',
        escapeCommas(p.attending_physician ? `Dr. ${p.attending_physician}` : 'N/A'),
        p.has_philhealth ? 'Yes' : 'No',
        p.has_hmo ? 'Yes' : 'No',
        escapeCommas(p.hmo),
        escapeCommas(p.emergency_contact_name),
        escapeCommas(p.emergency_contact_phone),
        formatDate(p.entry_date),
        escapeCommas(p.notes)
      ].join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger it
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient-report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const handleSelectedItem = async (filteredId) => {
    console.log(filteredId.id)
    setIsDropdownVisible(false);
    setSearchTerm(filteredId.code);
    navigate(`/reports/${filteredId.id}/medicalHistory/reports`)
  }

  // Add this pagination component
  const Pagination = () => {
    return (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages} ({totalItems} total records)
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {isMedicalHistory && (<div className={styles.searchBar}>
        <SearchBar
          // data={dummyBillingData}
          placeholder={"🔍 Search patients by ID or name"}
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
      </div>)}




      {!isMedicalHistory && (
        <div className={styles.filterRow}>
          <div className={styles.dateGroup}>
            <label htmlFor="start-date" className={styles.dateLabel}>Start Date:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.dateGroup}>
            <label htmlFor="end-date" className={styles.dateLabel}>End Date:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <button onClick={handleGeneratePdf} className={styles.buttonPrimary}>PDF</button>
          <button onClick={handleGenerateCsv} className={styles.buttonSecondary}>CSV</button>
        </div>
      )}
      <div className={styles.itemsPerPageGroup}>
        <label htmlFor="items-per-page" className={styles.dateLabel}>Items per page:</label>
        <input
          id="items-per-page"
          type="number"
          min={1}
          value={itemsPerPage}
          onChange={e => {
            const val = Math.max(1, Number(e.target.value));
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
          className={styles.dateInput}
          style={{ width: 80 }}
        />
      </div>


      <div ref={tableRef} className={styles.tableContainer}>
        {loading ? (
          <p className={styles.loadingText}>Loading patients...</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>


                {isMedicalHistory ? (<tr>
                  {['Patient ID', 'Patient', 'Record Type', 'Attending Physician', 'Admission/Visit Date', 'Bed Number', 'Action'].map((h, i) => (
                    <th key={i} className={styles.th}>{h}</th>
                  ))}
                </tr>) : (<tr>
                  {['Patient ID', 'Patient', 'Record Type', 'Attending Physician', 'Admission/Visit Date', 'Bed Number'].map((h, i) => (
                    <th key={i} className={styles.th}>{h}</th>
                  ))}
                </tr>)}
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id} className={styles.tr}>
                    <td className={styles.td}>{patient.code}</td>
                    <td className={styles.td}>{patient.name}</td>
                    <td className={styles.td}>{patient.status === 'Admitted' ? 'Inpatient' : 'Outpatient'}</td>
                    <td className={styles.td}>{patient.attending_physician ? `Dr. ${patient.attending_physician}` : 'N/A'}</td>
                    <td className={styles.td}>{new Date(patient.admission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className={styles.td}>{patient.bed_number || 'None'}</td>

                    {isMedicalHistory && (
                      <td className={styles.td}>
                        <button
                          onClick={() => {
                            navigate(`/reports/${patient.id}/medicalHistory/reports`)
                            setIsDropdownVisible(false);
                            setSearchTerm('')
                          }}
                          className={styles.linkButton}
                          title="View PDF Report"
                        >
                          <i className="fas fa-file-csv" style={{ color: 'green', marginRight: 6 }}></i> CSV
                        </button>
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination />




            {/* OVERLAY MODAL */}
            {params.id && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <button
                    onClick={() => {
                      navigate(-1)
                      setIsDropdownVisible(false)
                      setSearchTerm('')
                    }}
                    className={styles.closeButton}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <PatientHistory setSelectedMedicalHistory={setSelectedMedicalHistory} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientReport;
