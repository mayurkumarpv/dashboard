import React from 'react';

export default function TaskTextarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  maxLength,
  showCounter = false,
  placeholder,
  rows = 3,
  disabled = false,
  ...props
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        {...props}
      />

      <div className="flex justify-between items-center mt-1">
        {error && (
          <p id={`${name}-error`} className="text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}
        {showCounter && maxLength && (
          <p className={`text-xs ml-auto ${
            value.length > maxLength * 0.9 ? 'text-amber-600' : 'text-gray-500'
          }`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}