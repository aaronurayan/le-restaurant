import React from 'react';
import { ReservationStatus } from '../../hooks/useReservationManagementApi';

/**
 * ReservationFilters - Molecule Component
 * F109 - Reservation Management Feature
 * 
 * Filter controls for reservations list.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationFiltersProps {
  statusFilter: ReservationStatus | '';
  startDateFilter: string;
  endDateFilter: string;
  searchQuery: string;
  onStatusChange: (status: ReservationStatus | '') => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSearchChange: (query: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onShowPending: () => void;
  loading: boolean;
}

const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  statusFilter,
  startDateFilter,
  endDateFilter,
  searchQuery,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  onShowPending,
  loading,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as ReservationStatus | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {Object.values(ReservationStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label htmlFor="start-date-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            id="start-date-filter"
            type="date"
            value={startDateFilter}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter start date"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label htmlFor="end-date-filter" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            id="end-date-filter"
            type="date"
            value={endDateFilter}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter end date"
          />
        </div>

        {/* Search by Customer Name */}
        <div>
          <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <input
            id="search-query"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onApplyFilters}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={onClearFilters}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-400 transition-colors"
        >
          Clear Filters
        </button>
        <button
          onClick={onShowPending}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400 transition-colors"
        >
          Show Pending Only
        </button>
      </div>
    </div>
  );
};

export default ReservationFilters;
