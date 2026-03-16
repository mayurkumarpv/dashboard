import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '../icons';
import { SORT_ORDER } from '../../constants.js';

export default function SortButton({ 
  sortOrder, 
  onToggle, 
  label = 'Sort',
  className = '',
  disabled = false
}) {
  const isAscending = sortOrder === SORT_ORDER.ASC;
  
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      aria-label={`${label}: ${isAscending ? 'Ascending' : 'Descending'}`}
    >
      {isAscending ? (
        <>
          <ChevronUpIcon className="w-4 h-4" />
          Earliest First
        </>
      ) : (
        <>
          <ChevronDownIcon className="w-4 h-4" />
          Latest First
        </>
      )}
    </button>
  );
}