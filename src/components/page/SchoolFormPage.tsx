'use client';

import React from 'react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { SchoolForm } from '../organisms/SchoolForm';

const SchoolFormPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <SchoolForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SchoolFormPage; 