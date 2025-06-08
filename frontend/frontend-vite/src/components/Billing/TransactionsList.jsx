// TransactionsList.jsx
import React, { useState, useEffect } from 'react';
import styles from './TransactionsList.module.css';
import { FaSort, FaSortUp, FaSortDown, FaRegFilePdf, FaRegFileExcel } from 'react-icons/fa';
import { listOfBillingsAPI } from '../../api/axios'; // Import your API function
import TransactionDetailsModal from './TransactionDetailsModal';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //modal details
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Paginations
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  //multiSelect => use SET coz of uniqueness (DSA)
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [filters, setFilters] = useState({
    sortBy: 'date_created',
    sortOrder: 'desc',
    search: '',
    statusFilter: 'all'
  });


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await listOfBillingsAPI(currentPage, pageSize);
        console.log(response.data)
        // Handle response data
        if (response && response.data) {
          setTransactions(response.data.results || []);
          setTotalItems(response.data.count || 0);
          setTotalPages(Math.ceil(response.data.count / pageSize)); // in backend 3 is limit per page
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    currentPage,
    pageSize,
    filters.search,
    filters.statusFilter,
    filters.sortBy,
    filters.sortOrder,
  ]);


  //reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.statusFilter, filters.search]);



  const handleSort = (criteria) => {
    const order = filters.sortBy === criteria && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters({ ...filters, sortBy: criteria, sortOrder: order });
  };





  //how selection works herE? dependent to boolean state
  // selection handlers
  const toggleOne = (newCode) => {


    setSelectedCodes((existingSelectedCodes) => {
      //create new set with existingSelectedCodes
      //if the next (with existingSelectedCodes) has existing newCode... do this
      const next = new Set(existingSelectedCodes);
      next.has(newCode) ? next.delete(newCode) : next.add(newCode);



      return next;
    });


  };

  const toggleAll = () => {
    if (selectAll) {
      setSelectedCodes(new Set());
      setSelectAll(false);
    } else {
      const allCodes = transactions.map((t) => t.code);
      setSelectedCodes(new Set(allCodes));
      setSelectAll(true);
    }
  };


  //csv exporter
  const exportToCSV = () => {

    if (selectedCodes.size === 0) {
      alert('exportToCSV check at least 1');
      return;
    }

    const selectedTransactions = transactions.filter(t =>
      selectedCodes.has(t.code)
    );




    const csvHeaders = [
      'Billing Code',
      'Patient Name',
      'Date',
      'Status',
      'Amount',
      'Created By'
    ];


    const csvRows = selectedTransactions.map(t => [
      t.code,
      t.patient.name,
      formatDate(t.date_created),
      t.status,
      t.total_due,
      t.created_by.role
    ]);


    //build csv content
    // (H) "Billing ID,Patient Name,Date,Status,Amount,Created By"

      //LOOPED
    // (R) "TX123,John Doe,2025-06-08,Completed,150.00,Admin" /n
    // (R) "TX124,Jane Smith,2025-06-07,Pending,200.00,Teller" /n

    // csvHeaders.join(',')
    // csvRows.map(row => row.join(','))
    const headerRow = csvHeaders.join(',');
    const dataRows = csvRows.map(row => row.join(','));
    const csvContent = [headerRow].concat(dataRows).join('\n');

    console.log(csvContent);

    //create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();

  }



  const sortedTransactions = [...transactions].sort((a, b) => {
    const aValue = a[filters.sortBy];
    const bValue = b[filters.sortBy];

    // Handle nested objects (like patient.name)
    const aComparable = typeof aValue === 'object' ? aValue?.name || '' : aValue;
    const bComparable = typeof bValue === 'object' ? bValue?.name || '' : bValue;

    if (filters.sortOrder === 'desc') {
      return aComparable > bComparable ? -1 : 1;
    }
    return aComparable < bComparable ? -1 : 1;
  });

  const filteredTransactions = sortedTransactions.filter(
    (trnsction) =>
      trnsction.patient?.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.statusFilter === 'all' || trnsction.status === filters.statusFilter)
  );

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleConfirm = () => {
    console.log('Selected billing codes:', Array.from(selectedCodes));
  };

  if (loading) {
    return <div className={styles.loading}>Loading transactions...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Transaction List</h2>

        <div className={styles.controls}>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Search by patient name..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.dropdownGroup}>
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              value={filters.statusFilter}
              onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
              className={styles.dropdown}
            >
              <option value="all">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partial">Partial</option>
            </select>
          </div>



          {/* PAGE SIZE SELECTION */}

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={styles.dropdown}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} / {totalPages}
              </option>
            ))}
          </select>

          {/* PAGE SIZE SELECTION */}




          {/* MULTI SELECTION HANDLER */}
          <button onClick={handleConfirm} className={styles.primaryBtn}>
            Confirm Selection ({selectedCodes.size})
          </button>
          {/* MULTI SELECTION HANDLER */}


          <div className={styles.actionButtons}>
            <button className={styles.exportButton}>
              <FaRegFilePdf /> PDF
            </button>
            <button className={styles.exportButton} onClick={exportToCSV}>
              <FaRegFileExcel /> CSV
            </button>
          </div>
        </div>
      </div>

      {/* table */}
      <div className={styles.tableContainer}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleAll}
                />
              </th>
              <th
                onClick={() => handleSort('code')}
                className={styles.sortable}
              >
                Billing ID
                {filters.sortBy === 'code' && (
                  filters.sortOrder === 'desc' ? (
                    <FaSortDown />
                  ) : (
                    <FaSortUp />
                  )
                )}
              </th>
              <th
                onClick={() => handleSort('patient')}
                className={styles.sortable}
              >
                Patient
                {filters.sortBy === 'patient' && (
                  filters.sortOrder === 'desc' ? (
                    <FaSortDown />
                  ) : (
                    <FaSortUp />
                  )
                )}
              </th>
              <th
                onClick={() => handleSort('date_created')}
                className={styles.sortable}
              >
                Date
                {filters.sortBy === 'date_created' && (
                  filters.sortOrder === 'desc' ? (
                    <FaSortDown />
                  ) : (
                    <FaSortUp />
                  )
                )}
              </th>
              <th>Status</th>
              <th
                onClick={() => handleSort('total_due')}
                className={styles.sortable}
              >
                Amount
                {filters.sortBy === 'total_due' && (
                  filters.sortOrder === 'desc' ? (
                    <FaSortDown />
                  ) : (
                    <FaSortUp />
                  )
                )}
              </th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trnsction) => (
              <tr
                key={trnsction.id}
                className={styles.row}
                onClick={() => {
                  setSelectedTransaction(trnsction);
                  setShowModal(true);
                }}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    // CHECK THEM THRU BOOL??
                    checked={selectedCodes.has(trnsction.code)}
                    onChange={() => toggleOne(trnsction.code)}
                  />
                </td>
                <td>{trnsction.code}</td>
                <td>{trnsction.patient.name}</td>
                <td>{formatDate(trnsction.date_created)}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${styles[`status-${trnsction.status.toLowerCase()}`]
                      }`}
                  >
                    {trnsction.status}
                  </span>
                </td>
                <td>₱{trnsction.total_due}</td>
                <td>{trnsction.created_by.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalItems)} of {totalItems} results
        </div>

        <div className={styles.paginationControls}>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
          >
            Previous
          </button>

          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TransactionsList;