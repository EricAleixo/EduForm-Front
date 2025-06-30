'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/molecules/LoginForm';
import { AdminPanel } from '@/components/organisms/AdminPanel';
import { authService } from '@/app/services/authService';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Verificar se há token salvo
      if (authService.isAuthenticated()) {
        // Verificar se o token ainda é válido
        try {
          await authService.getProfile();
          setIsAuthenticated(true);
        } catch {
          // Token inválido, limpar dados
          authService.logout();
          setIsAuthenticated(false);
        }
      }
    } catch {
      console.error('Erro ao verificar status de autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Redirecionar para a página inicial ou login
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        isFirstAdmin={false}
      />
    );
  }

  return (
    <AdminPanel onLogout={handleLogout} />
  );
} 