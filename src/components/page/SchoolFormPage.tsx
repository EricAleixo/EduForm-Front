'use client';

import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { SchoolForm } from '../organisms/SchoolForm';
import { Notification } from '../atoms/Notification';

const SchoolFormPage: React.FC = () => {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
    title?: string;
  }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => {
    setNotification({
      type,
      message,
      isVisible: true,
      title,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <Header />
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        title={notification.title}
      />
      <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8 mt-16">
        <div className="w-full max-w-4xl mx-auto">
          <SchoolForm onNotification={showNotification} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SchoolFormPage; 