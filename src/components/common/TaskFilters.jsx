import React from 'react';
import SortButton from './SortButton';
import { ALL, PENDING, IN_PROGRESS, COMPLETED } from '../../constants.js';

export default function TaskFilters({
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortToggle,
  showStatusFilter = true,
  totalCount,
  filteredCount,
  className = ''
}) {
  const statusOptions = [
    { value: ALL, label: 'All Status' },
    { value: PENDING, label: 'Pending' },
    { value: IN_PROGRESS, label: 'In Progress' },
    { value: COMPLETED, label: 'Completed' }
  ];

  return (
    <div className={`bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-wrap gap-4 items-center">
        {showStatusFilter && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Sort by Due Date:
          </span>
          <SortButton 
            sortOrder={sortOrder}
            onToggle={onSortToggle}
            label="Sort by due date"
          />
        </div>

        {totalCount !== undefined && (
          <div className="ml-auto">
            <span className="text-sm text-gray-600">
              {filteredCount} {totalCount !== filteredCount ? `of ${totalCount}` : ''} tasks
            </span>
          </div>
        )}
      </div>
    </div>
  );
}