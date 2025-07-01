import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getUserLogsAPI, getAllUserLogsAPI } from '../../api/axios';
import styles from './reports.module.css';

const LoggingReports = () => {
  const today = new Date();
  const isoToday = today.toISOString().split('T')[0];
  const isoStartOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(isoStartOfYear);
  const [endDate, setEndDate] = useState(isoToday);
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('current');

  const tableRef = useRef();

  const fetchUserLogs = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const response = viewMode === 'all' 
        ? await getAllUserLogsAPI(startDate, endDate, currentPage, itemsPerPage)
        : await getUserLogsAPI(startDate, endDate, currentPage, itemsPerPage);
      
      setUserLogs(response.data.results || response.data);
      console.log('User logs:', response.data);

      if (response.data.count !== undefined) {
        setTotalItems(response.data.count);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
      } else {
        setTotalItems(response.data.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed fetching user logs:', error);
      setUserLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLogs();
  }, [startDate, endDate, currentPage, itemsPerPage, viewMode]);

  const handleGeneratePdf = () => {
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    const columns = [
      { header: 'User', dataKey: 'user_name' },
      { header: 'Action', dataKey: 'action' },
      { header: 'Timestamp', dataKey: 'timestamp' },
      { header: 'IP Address', dataKey: 'ip_address' },
      { header: 'User Agent', dataKey: 'user_agent' },
      { header: 'Details', dataKey: 'details' }
    ];

    const rows = userLogs.map(log => ({
      user_name: log.user_info?.full_name || log.user_info?.user_id || log.user || 'N/A',
      action: log.action || 'N/A',
      timestamp: log.timestamp 
        ? new Date(log.timestamp).toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'N/A',
      ip_address: log.ip_address || 'N/A',
      user_agent: log.user_agent ? log.user_agent.substring(0, 50) + '...' : 'N/A',
      details: log.details 
        ? (typeof log.details === 'object' 
            ? JSON.stringify(log.details).substring(0, 100) + '...'
            : log.details.substring(0, 100) + '...')
        : 'N/A'
    }));

    autoTable(pdf, {
      columns,
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 40 },
      columnStyles: {
        user_agent: { cellWidth: 80 },
        details: { cellWidth: 120 }
      }
    });

    pdf.save(`user-logs_${startDate}_to_${endDate}.pdf`);
  };

  const handleGenerateCsv = () => {
    const headers = [
      'User', 'Action', 'Timestamp', 'IP Address', 'User Agent', 'Details'
    ].join(',');

    const csvRows = userLogs.map(log => {
      const formatTimestamp = (timestamp) => timestamp 
        ? new Date(timestamp).toLocaleString('en-US')
        : 'N/A';
      const escapeCommas = (value) => {
        const str = value ? String(value) : 'N/A';
        return `"${str.replace(/"/g, '""')}"`;
      };

      return [
        escapeCommas(log.user_info?.full_name || log.user_info?.user_id || log.user || 'N/A'),
        escapeCommas(log.action || 'N/A'),
        escapeCommas(formatTimestamp(log.timestamp)),
        escapeCommas(log.ip_address || 'N/A'),
        escapeCommas(log.user_agent || 'N/A'),
        escapeCommas(
          log.details 
            ? (typeof log.details === 'object' 
                ? JSON.stringify(log.details)
                : String(log.details))
            : 'N/A'
        )
      ].join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user-logs_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
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
      <div className={styles.filterRow}>
        <div className={styles.dateGroup}>
          <label htmlFor="view-mode" className={styles.dateLabel}>View Mode:</label>
          <select
            id="view-mode"
            value={viewMode}
            onChange={e => {
              setViewMode(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.dateInput}
          >
            <option value="current">My Logs</option>
            <option value="all">All Users (Admin)</option>
          </select>
        </div>
        
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
          <p className={styles.loadingText}>Loading user logs...</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  {['User', 'Action', 'Timestamp', 'IP Address', 'User Agent', 'Details'].map((header, index) => (
                    <th key={index} className={styles.th}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userLogs.length > 0 ? (
                  userLogs.map((log, index) => (
                    <tr key={log.id || index} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {log.user_info?.image ? (
                              <img 
                                src={log.user_info.image} 
                                alt={log.user_info.full_name || 'User'}
                                className={styles.avatarImage}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={styles.avatarFallback}
                              style={{ display: log.user_info?.image ? 'none' : 'flex' }}
                            >
                              {log.user_info?.full_name 
                                ? log.user_info.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                : log.user_info?.user_id?.slice(0, 2).toUpperCase() || 'NA'
                              }
                            </div>
                          </div>
                          <div className={styles.userDetails}>
                            <div className={styles.userName}>
                              {log.user_info?.full_name || 'Unknown User'}
                            </div>
                            <div className={styles.userId}>
                              ID: {log.user_info?.user_id || 'N/A'}
                            </div>
                            <div className={styles.userRole}>
                              {log.user_info?.role || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.actionBadge} ${styles[log.action?.toLowerCase()] || ''}`}>
                          {log.action || 'N/A'}
                        </span>
                      </td>
                      <td className={styles.td}>
                        {log.timestamp 
                          ? new Date(log.timestamp).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'
                        }
                      </td>
                      <td className={styles.td}>{log.ip_address || 'N/A'}</td>
                      <td className={styles.td} title={log.user_agent}>
                        {log.user_agent 
                          ? log.user_agent.length > 30 
                            ? log.user_agent.substring(0, 30) + '...'
                            : log.user_agent
                          : 'N/A'
                        }
                      </td>
                      <td className={styles.td} title={
                        log.details 
                          ? (typeof log.details === 'object' 
                              ? JSON.stringify(log.details, null, 2)
                              : log.details)
                          : 'N/A'
                      }>
                        {log.details 
                          ? (typeof log.details === 'object' 
                              ? JSON.stringify(log.details).length > 50
                                ? JSON.stringify(log.details).substring(0, 50) + '...'
                                : JSON.stringify(log.details)
                              : log.details.length > 50
                                ? log.details.substring(0, 50) + '...'
                                : log.details)
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.noData}>
                      No logs found for the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
};

export default LoggingReports