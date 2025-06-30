'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  title,
  duration = 5000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200',
          bgLight: 'bg-green-50',
          title: title || 'Sucesso!',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          iconColor: 'text-red-500',
          borderColor: 'border-red-200',
          bgLight: 'bg-red-50',
          title: title || 'Erro!',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200',
          bgLight: 'bg-yellow-50',
          title: title || 'Atenção!',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        };
      case 'info':
        return {
          bgColor: 'bg-blue-500',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200',
          bgLight: 'bg-blue-50',
          title: title || 'Informação!',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const styles = getNotificationStyles();

  // Evita erro de tipo: só renderiza o portal no client
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-20 sm:top-32 right-4 z-[10000] animate-slide-in max-w-xs w-full">
      <div className={`
        bg-white border-2 ${styles.borderColor} rounded-xl shadow-xl p-3 sm:p-4 max-w-sm mx-auto sm:mx-0
        transform transition-all duration-300 ease-out hover:shadow-2xl
      `}>
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 ${styles.bgColor} rounded-full flex items-center justify-center animate-bounce-in`}>
            {styles.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-xs sm:text-sm font-semibold ${styles.iconColor}`}>
              {styles.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{message}</p>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110 p-1"
            title="Fechar notificação"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Barra de progresso */}
        <div className="mt-2 sm:mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${styles.bgColor} transition-all duration-300 ease-linear`}
            style={{ 
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}; 