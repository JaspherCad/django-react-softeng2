// Pagination.jsx
import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ 
  currentPage, 
  totalItems, 
  pageSize,
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Add dots and middle pages if needed
    if (totalPages <= 5) {
      for (let i = 2; i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > 3) pageNumbers.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) pageNumbers.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) pageNumbers.push(totalPages);
    
    return pageNumbers;
  };

  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;