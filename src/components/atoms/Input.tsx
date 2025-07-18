'use client';

import React, { useState } from 'react';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  required = false,
  value = '',
  onChange,
  error,
  icon
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  React.useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const maskPhone = (value: string) => {
    // Remove tudo que não for número
    value = value.replace(/\D/g, '');
    if (value.length <= 2) return value.replace(/(\d{0,2})/, '($1');
    if (value.length <= 6) return value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    if (value.length <= 10) return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return value.replace(/(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (type === 'tel') {
      newValue = maskPhone(newValue);
    }
    setHasValue(!!newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="relative w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-700 bg-white border-2 rounded-xl
            transition-all duration-300 ease-in-out
            ${icon ? 'pl-10 sm:pl-12' : ''}
            ${isFocused || hasValue ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}
            ${error ? 'border-red-500 shadow-red-100' : ''}
            focus:outline-none focus:ring-0
            ${!hasValue && type === 'date' ? 'pt-6' : ''}
            ${!hasValue && type !== 'date' ? 'placeholder-transparent' : ''}
          `}
        />
        <label
          className={`
            absolute left-3 sm:left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none
            ${icon ? 'left-10 sm:left-12' : ''}
            ${isFocused || hasValue ? 'text-blue-600 text-xs sm:text-sm -top-2 bg-blue-50 px-2 border border-blue-200 rounded-md' : type === 'date' ? 'text-xs sm:text-sm top-2' : 'text-sm sm:text-base top-3 sm:top-4'}
            ${error ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {error && (
        <p className="mt-2 text-xs sm:text-sm text-red-500 flex items-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}; 