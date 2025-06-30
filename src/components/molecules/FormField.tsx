'use client';

import React from 'react';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { FileUpload } from '../atoms/FileUpload';

interface FormFieldProps {
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'file';
  label: string;
  name: string;
  value?: string | File | null;
  onChange?: (value: string | File | null) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
  description?: string;
  accept?: string;
  maxSize?: number;
  onNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  type,
  label,
  name,
  value = '',
  onChange,
  required = false,
  error,
  placeholder,
  options = [],
  icon,
  description,
  accept,
  maxSize,
  onNotification
}) => {
  if (type === 'file') {
    return (
      <FileUpload
        label={label}
        name={name}
        value={value as File | null}
        onChange={onChange as (file: File | null) => void}
        required={required}
        error={error}
        accept={accept}
        maxSize={maxSize}
        description={description}
        icon={icon}
        onNotification={onNotification}
      />
    );
  }

  return (
    <div className="space-y-2">
      {type === 'select' ? (
        <Select
          label={label}
          options={options}
          value={value as string}
          onChange={onChange as (value: string) => void}
          required={required}
          error={error}
          placeholder={placeholder}
        />
      ) : (
        <Input
          label={label}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value as string}
          onChange={onChange as (value: string) => void}
          error={error}
          icon={icon}
        />
      )}
      
      {description && !error && (
        <p className="text-sm text-gray-500 flex items-start">
          <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {description}
        </p>
      )}
    </div>
  );
}; 