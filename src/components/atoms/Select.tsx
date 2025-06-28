'use client';

import React, { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value = '',
  onChange,
  required = false,
  error,
  placeholder = 'Selecione uma opção'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const hasValue = !!selectedOption;

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 text-left text-gray-700 bg-white border-2 rounded-xl
            transition-all duration-300 ease-in-out flex items-center justify-between
            ${isFocused || hasValue ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}
            ${error ? 'border-red-500 shadow-red-100' : ''}
            focus:outline-none focus:ring-0
            ${!hasValue ? 'pt-6' : ''}
          `}
        >
          <span className={hasValue ? 'text-gray-700' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <label
          className={`
            absolute left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none
            ${isFocused || hasValue ? 'text-blue-600 text-sm -top-2 bg-blue-50 px-2 border border-blue-200 rounded-md' : 'text-sm top-2'}
            ${error ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-blue-500 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200
                  ${option.value === value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}; 