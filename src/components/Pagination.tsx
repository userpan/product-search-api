import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showEllipsis = totalPages > 5;
    
    if (showEllipsis) {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded text-sm sm:text-base bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        &lt;
      </button>
      {getPageNumbers().map((number, index) => (
        <button
          key={index}
          onClick={() => typeof number === 'number' && onPageChange(number)}
          className={`px-2 py-1 rounded text-sm sm:text-base ${
            number === currentPage
              ? 'bg-blue-500 text-white'
              : number === '...'
              ? 'bg-gray-100 text-gray-700 cursor-default'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          disabled={number === '...'}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded text-sm sm:text-base bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;