'use client';

import React, { useState, useRef } from 'react';

interface FileUploadProps {
  label: string;
  name: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  required?: boolean;
  error?: string;
  accept?: string;
  maxSize?: number;
  description?: string;
  icon?: React.ReactNode;
  onNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5,
  description,
  icon,
  onNotification
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    if (onNotification) {
      onNotification(type, message);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    
    // Simular processamento para melhor UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (file.size > maxSize * 1024 * 1024) {
      showNotification('error', `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      setIsProcessing(false);
      return;
    }
    
    // Validar tipo de arquivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => type.trim().replace('.', ''));
    
    if (!acceptedTypes.includes(fileExtension || '')) {
      showNotification('error', `Tipo de arquivo não suportado. Formatos aceitos: ${accept}`);
      setIsProcessing(false);
      return;
    }
    
    // Validações adicionais para documentos de identidade
    if (name === 'documentoIdentidade') {
      if (file.size < 1024) { // Menos de 1KB
        showNotification('warning', 'O arquivo parece muito pequeno. Verifique se é uma imagem válida.');
      }
      
      if (fileExtension === 'pdf' && file.size > 2 * 1024 * 1024) { // PDF maior que 2MB
        showNotification('warning', 'PDF muito grande. Considere compactar o arquivo.');
      }
    }
    
    onChange?.(file);
    showNotification('success', `Arquivo "${file.name}" selecionado com sucesso!`);
    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Adicionar animação de sucesso
      const dropZone = e.currentTarget;
      dropZone.classList.add('animate-file-drop');
      setTimeout(() => {
        dropZone.classList.remove('animate-file-drop');
      }, 300);
      
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotification('success', 'Arquivo removido com sucesso!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          required={required}
        />
        
        {!value ? (
          <div
            className={`
              relative w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer
              transition-all duration-300 ease-in-out group
              ${isDragOver 
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100 animate-pulse-glow' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }
              ${error ? 'border-red-500 bg-red-50' : ''}
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
          >
            {isProcessing && (
              <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center z-10">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Processando arquivo...</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col items-center space-y-4">
              {icon ? (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  {isDragOver ? 'Solte o arquivo aqui' : 'Clique ou arraste o arquivo'}
                </p>
                <p className="text-sm text-gray-500">
                  {accept.includes('.pdf') && 'PDF, JPG, PNG até ' + maxSize + 'MB'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Formatos aceitos: {accept}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full p-6 bg-green-50 border-2 border-green-200 rounded-xl animate-success-check">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getFileIcon(value.name)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{value.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(value.size)}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200 hover:scale-110"
                title="Remover arquivo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <label
          className={`
            absolute left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none
            ${value ? 'text-green-600 text-sm -top-2 bg-green-50 px-2 border border-green-200 rounded-md' : 'text-sm top-2'}
            ${error ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {description && !error && !value && (
        <p className="text-sm text-gray-500 flex items-start">
          <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {description}
        </p>
      )}
      
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