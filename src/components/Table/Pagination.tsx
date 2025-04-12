import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Calculate the page range to display
  const getPageRange = () => {
    const maxPagesToShow = 5; // Number of page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageRange = getPageRange();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
            currentPage === 1
              ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
          }`}
        >
          <span className="sr-only">Previous</span>
          <FiChevronLeft className="h-5 w-5" />
        </button>
        
        {/* First page link (if not in range) */}
        {!pageRange.includes(1) && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="relative inline-flex hover:cursor-pointer items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
            >
              1
            </button>
            {pageRange[0] > 2 && (
              <span className="relative inline-flex hover:cursor-pointer items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300">
                ...
              </span>
            )}
          </>
        )}
        
        {/* Page numbers */}
        {pageRange.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center hover:cursor-pointer px-4 py-2 border text-sm font-medium ${
              page === currentPage
                ? 'z-10 bg-blue-800 border-blue-600 text-blue-200'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {page}
          </button>
        ))}
        
        {/* Last page link (if not in range) */}
        {!pageRange.includes(totalPages) && totalPages > 1 && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="relative inline-flex hover:cursor-pointer items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
            currentPage === totalPages
              ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
          }`}
        >
          <span className="sr-only">Next</span>
          <FiChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination; 