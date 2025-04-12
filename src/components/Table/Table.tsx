import { useState } from 'react';
import Pagination from './Pagination';
import { FiChevronUp, FiChevronDown, FiArrowDown, FiArrowUp } from 'react-icons/fi';

export interface Column {
  key: string;
  header: string;
  sortable: boolean;
}

export interface TableProps {
  data: Record<string, any>[];
  columns: Column[];
  itemsPerPage?: number;
  title?: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

function Table({ data, columns, itemsPerPage = 10, title }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  // Apply sorting to data
  const sortedData = [...data];
  if (sortState.column && sortState.direction) {
    sortedData.sort((a, b) => {
      const aValue = a[sortState.column as string];
      const bValue = b[sortState.column as string];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (sortState.direction === 'asc') {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSort = (column: string) => {
    if (!columns.find(col => col.key === column)?.sortable) {
      return;
    }

    setSortState(prev => {
      if (prev.column === column) {
        if (prev.direction === 'asc') {
          return { column, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { column: null, direction: null };
        } else {
          return { column, direction: 'asc' };
        }
      } else {
        return { column, direction: 'asc' };
      }
    });
  };

  // Helper function to render sort indicator
  const renderSortIndicator = (column: string) => {
    const isActive = column === sortState.column;

    return (
      <span className="inline-flex flex-col ml-1">
        {isActive ? (
          sortState.direction === 'asc' ? (
            <FiChevronUp className="w-4 h-4 text-blue-400" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-blue-400" />
          )
        ) : (
          <span className="flex flex-col w-4 h-4 text-gray-500">
            <FiArrowUp className="w-3 h-3" />
            <FiArrowDown className="w-3 h-3 -mt-1" />
          </span>
        )}
      </span>
    );
  };

  // Helper function to format cell values
  const formatCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'number') {
      // Format numbers with 2 decimal places if they have decimals
      return Number.isInteger(value) ? value : value.toFixed(2);
    }

    return value;
  };

  // Render table header
  const renderTableHeader = () => {
    return (
      <thead className="bg-gray-800">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${column.sortable ? 'cursor-pointer select-none hover:text-gray-100' : ''
                }`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center space-x-1">
                <span>{column.header}</span>
                {column.sortable && renderSortIndicator(column.key)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  // Render table body
  const renderTableBody = () => {
    return (
      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {paginatedData.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-6 py-4 text-center text-sm text-gray-400"
            >
              No data available
            </td>
          </tr>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                >
                  {formatCellValue(row[column.key])}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    );
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg shadow-md bg-gray-800 border border-gray-700 mb-4">
        {title && (
          <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default Table; 