import React, { useState, useMemo } from "react";
import styles from "./PatientRecords.module.css";
import { useNavigate } from "react-router-dom";

const ListOfRecords = () => {
  const navigate = useNavigate();

  const [records] = useState([
    {
      caseNumber: "GHEO131",
      recordType: "Outpatient",
      date: "2024-06-10",
    },
    {
      caseNumber: "PEMG449",
      recordType: "Outpatient",
      date: "2024-06-08",
    },
    {
      caseNumber: "LEJN884",
      recordType: "Inpatient",
      date: "2024-06-11",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter patients based on search term
  const filteredRecords = useMemo(() => {
    return records.filter(
      (records) =>
        records.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        records.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewPatient = (patientId) => {
    console.log(`Navigating to patient details for ID: ${patientId}`);
  };

  const handleAddPatient = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleNewInpatient = () => {
    navigate("addInpatient");
  };

  const handleNewOutpatient = () => {
    navigate("addOutpatient");
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Viewing Patient Records</h1>
          <div className={styles.hospitalLogo}>
            <img
              src="./hospital_logo.png"
              alt="Antipolo Centro De Medikal Hospital Logo"
              className={styles.logoImage}
            />
          </div>
        </div>
      </header>

      {/* Patient Records Content */}
      <div className={styles.content}>
        {/* Top Actions */}
        <div className={styles.topActions}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search records"
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
              mn
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <button className={styles.addButton} onClick={handleAddPatient}>
            + Add Patient Record
          </button>
        </div>

        {/* Records Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Case Number</th>
                <th className={styles.tableHeaderCell}>Record Type</th>
                <th className={styles.tableHeaderCell}>Date</th>
                <th className={styles.tableHeaderCell}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((records) => (
                  <tr key={records.caseNumber} className={styles.tableRow}>
                    <td className={`${styles.tableCell} ${styles.patientId}`}>
                      {records.caseNumber}
                    </td>
                    <td className={`${styles.tableCell} ${styles.patientName}`}>
                      {records.recordType}
                    </td>
                    <td className={`${styles.tableCell} ${styles.patientName}`}>
                      {records.date}
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleViewPatient(records.caseNumber)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noRecords}>
                    No patient records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={`${styles.paginationButton} ${
                currentPage === 1
                  ? styles.paginationButtonDisabled
                  : styles.paginationButtonInactive
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`${styles.paginationButton} ${styles.pageNumber} ${
                  currentPage === index + 1
                    ? styles.paginationButtonActive
                    : styles.paginationButtonInactive
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className={`${styles.paginationButton} ${
                currentPage === totalPages
                  ? styles.paginationButtonDisabled
                  : styles.paginationButtonInactive
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Records Info */}
        <div className={styles.recordsInfo}>
          Showing {indexOfFirstRecord + 1} to{" "}
          {Math.min(indexOfLastRecord, filteredRecords.length)} of{" "}
          {filteredRecords.length} records
        </div>
      </div>

      {/* Add Patient Options Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderContent}>
                <h2 className={styles.modalTitle}>Add Patient Record</h2>
                <button
                  onClick={handleCloseModal}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>

              <div className={styles.optionsContainer}>
                <button
                  onClick={handleNewInpatient}
                  className={`${styles.optionButton} ${styles.newPatientOption}`}
                >
                  <div className={styles.optionContent}>
                    <div
                      className={`${styles.optionIcon} ${styles.newPatientIcon}`}
                    >
                      <span
                        className={`${styles.iconEmoji} ${styles.newPatientEmoji}`}
                      >
                        👤
                      </span>
                    </div>
                    <div>
                      <h3 className={styles.optionTitle}>
                        New Inpatient Record
                      </h3>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleNewOutpatient}
                  className={`${styles.optionButton} ${styles.existingPatientOption}`}
                >
                  <div className={styles.optionContent}>
                    <div
                      className={`${styles.optionIcon} ${styles.existingPatientIcon}`}
                    >
                      <span
                        className={`${styles.iconEmoji} ${styles.existingPatientEmoji}`}
                      >
                        📋
                      </span>
                    </div>
                    <div>
                      <h3 className={styles.optionTitle}>
                        New Outpatient Record
                      </h3>
                    </div>
                  </div>
                </button>
              </div>

              <div className={styles.modalFooter}>
                <button
                  onClick={handleCloseModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfRecords;
