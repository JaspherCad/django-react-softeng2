import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = '',
  itemName = 'items'
}) => {
  //BASE CASE: early return if  one page or no items
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  // Calculate item range for info display
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`${styles.paginationContainer} ${className}`}>
      {/* Pagination Info */}
      {showInfo && (
        <div className={styles.paginationInfo}>
          Showing {startItem} to {endItem} of {totalItems} {itemName}
        </div>
      )}

      {/* Pagination Controls */}
      <div className={styles.paginationControls}>
        {/* First Page Button */}
        {currentPage > 2 && (
          <button
            onClick={() => onPageChange(1)}
            className={styles.pageButton}
            title="First page"
          >
            <span className={styles.doubleArrow}>«</span>
          </button>
        )}

        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
          title="Previous page"
        >
          <span className={styles.arrow}>‹</span>
          <span className={styles.buttonText}>Previous</span>
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className={styles.pageNumbers}>
            {/* Show first page if not in visible range */}
            {visiblePages[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className={styles.pageButton}
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className={styles.ellipsis}>...</span>
                )}
              </>
            )}

            {/* Visible page numbers */}
            {visiblePages.map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
              >
                {page}
              </button>
            ))}

            {/* Show last page if not in visible range */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className={styles.ellipsis}>...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={styles.pageButton}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          title="Next page"
        >
          <span className={styles.buttonText}>Next</span>
          <span className={styles.arrow}>›</span>
        </button>

        {/* Last Page Button */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={styles.pageButton}
            title="Last page"
          >
            <span className={styles.doubleArrow}>»</span>
          </button>
        )}
      </div>

      {/* Page Jump Input (Optional) */}
      {totalPages > 10 && (
        <div className={styles.pageJump}>
          <span>Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className={styles.pageInput}
          />
          <span>of {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
