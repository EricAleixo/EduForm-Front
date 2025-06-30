'use client';

import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Notification } from '../atoms/Notification';
import { authService, LoginCredentials, User } from '@/app/services/authService';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  isFirstAdmin?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, isFirstAdmin = false }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showFirstAdmin, setShowFirstAdmin] = useState(isFirstAdmin);
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

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      showNotification('error', 'Por favor, preencha todos os campos', 'Campos Obrigatórios');
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (showFirstAdmin) {
        // Cadastro do primeiro administrador
        response = await authService.signupAdmin(credentials);
        showNotification('success', 'Administrador criado com sucesso!', 'Conta Criada');
      } else {
        // Login normal
        response = await authService.login(credentials);
        showNotification('success', 'Login realizado com sucesso!', 'Bem-vindo');
      }

      // Salvar dados de autenticação
      authService.saveAuthData(response.access_token, response.user);
      
      // Chamar callback de sucesso
      onLoginSuccess(response.user);
      
    } catch (error: unknown) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Erro de autenticação';
      let errorTitle = 'Erro';
      
      const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
      
      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Usuário ou senha incorretos';
        errorTitle = 'Credenciais Inválidas';
      } else if (axiosError.response?.status === 409 && showFirstAdmin) {
        errorMessage = 'Já existe um administrador cadastrado no sistema';
        errorTitle = 'Administrador Existente';
      } else if (axiosError.response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique as informações fornecidas';
        errorTitle = 'Dados Inválidos';
      }
      
      showNotification('error', errorMessage, errorTitle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {showFirstAdmin ? 'Criar Administrador' : 'Login Administrativo'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {showFirstAdmin 
              ? 'Configure o primeiro administrador do sistema'
              : 'Acesse o painel administrativo'
            }
          </p>
        </div>

        {/* Toggle Button */}
        <div className="text-center space-y-3 sm:space-y-4">
          <button
            onClick={() => setShowFirstAdmin(!showFirstAdmin)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showFirstAdmin 
              ? 'Já tenho uma conta? Fazer login' 
              : 'Primeiro acesso? Criar administrador'
            }
          </button>
          
          <div className="pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="text-gray-600 border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            >
              Voltar à Página Principal
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm sm:text-base transition-all duration-200 hover:border-gray-400"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm sm:text-base transition-all duration-200 hover:border-gray-400"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              loading={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              icon={
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              }
            >
              {loading 
                ? (showFirstAdmin ? 'Criando...' : 'Entrando...') 
                : (showFirstAdmin ? 'Criar Administrador' : 'Entrar')
              }
            </Button>
          </div>

          {/* Info Text */}
          {showFirstAdmin && (
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <svg className="w-4 h-4 inline mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Esta opção só está disponível para criar o primeiro administrador do sistema.
              </p>
            </div>
          )}
        </form>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        title={notification.title}
      />
    </div>
  );
}; 