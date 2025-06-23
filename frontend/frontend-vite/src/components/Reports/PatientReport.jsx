// PatientReport.js
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getPatientReportAPI } from '../../api/axios';
import styles from './reports.module.css';

const PatientReport = () => {
  // initialize default range: start of current year to today
  const today = new Date();
  const isoToday = today.toISOString().split('T')[0];
  const isoStartOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(isoStartOfYear);
  const [endDate, setEndDate] = useState(isoToday);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef();

  const fetchPatients = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const response = await getPatientReportAPI(startDate, endDate);
      setPatients(response.data);
    } catch (error) {
      console.error('Failed fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [startDate, endDate]);

  const handleGeneratePdf = () => {
    const input = tableRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`patient-report_${startDate}_${endDate}.pdf`);
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Patient Admission Report</h2>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Search patients by ID or name"
          className={styles.searchInput}
        />
      </div>

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
        <button onClick={fetchPatients} className={styles.button}>Filter</button>
        <button onClick={handleGeneratePdf} className={styles.buttonPrimary}>PDF</button>
      </div>

      <div ref={tableRef} className={styles.tableContainer}>
        {loading ? (
          <p className={styles.loadingText}>Loading patients...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {['Patient ID','Patient','Record Type','Attending Physician','Admission/Visit Date','Bed Number','Action'].map((h, i) => (
                  <th key={i} className={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id} className={styles.tr}>
                  <td className={styles.td}>{patient.code}</td>
                  <td className={styles.td}>{patient.name}</td>
                  <td className={styles.td}>{patient.status === 'Admitted' ? 'Inpatient' : 'Outpatient'}</td>
                  <td className={styles.td}>{patient.attending_physician ? `Dr. ${patient.attending_physician}` : 'N/A'}</td>
                  <td className={styles.td}>{new Date(patient.admission_date).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}</td>
                  <td className={styles.td}>{patient.bed_number || 'None'}</td>
                  <td className={styles.td}>
                    <button
                      onClick={() => window.location.href = `/medicalHistory/${patient.id}`}
                      className={styles.linkButton}
                    >Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientReport;
