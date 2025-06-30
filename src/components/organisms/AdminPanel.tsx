'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Notification } from '../atoms/Notification';
import { StudentFormModal } from './StudentFormModal';
import { useStudents } from '@/app/hooks/useStudents';
import { authService } from '@/app/services/authService';
import { Student } from '@/app/services/studentService';
import Image from 'next/image';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = React.memo(function AdminPanel({ onLogout }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [expandedTurma, setExpandedTurma] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<Student | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
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

  const { loading, fetchStudents, deleteStudent } = useStudents();

  // Carregar estudantes na montagem do componente
  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar estudantes quando searchTerm ou selectedFilter mudar
  useEffect(() => {
    filterStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, searchTerm, selectedFilter]);

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch {
      showNotification('error', 'Erro ao carregar estudantes', 'Erro de Carregamento');
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.serie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    switch (selectedFilter) {
      case 'recent':
        filtered = filtered.filter(student => {
          const createdAt = new Date(student.createdAt);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return createdAt >= oneWeekAgo;
        });
        break;
      case 'manha':
        filtered = filtered.filter(student => student.turno === 'manha');
        break;
      case 'tarde':
        filtered = filtered.filter(student => student.turno === 'tarde');
        break;
      case 'noite':
        filtered = filtered.filter(student => student.turno === 'noite');
        break;
      case 'integral':
        filtered = filtered.filter(student => student.turno === 'integral');
        break;
      case 'approved':
        filtered = filtered.filter(student => student.approved);
        break;
      case 'pending':
        filtered = filtered.filter(student => !student.approved);
        break;
      default:
        break;
    }

    setFilteredStudents(filtered);
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      showNotification('success', 'Estudante excluído com sucesso!', 'Exclusão Realizada');
      setShowDeleteModal(false);
      setStudentToDelete(null);
      // Remover estudante do estado local imediatamente
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erro ao excluir estudante:', error);
      showNotification('error', 'Erro ao excluir estudante. Tente novamente.', 'Erro na Exclusão');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleModalSuccess = () => {
    loadStudents();
    handleModalClose();
    showNotification('success', 'Estudante atualizado com sucesso', 'Atualização Realizada');
  };

  const handleShowDetails = (student: Student) => {
    setSelectedStudentForDetails(student);
    setShowDetailsModal(true);
  };

  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setSelectedStudentForDetails(null);
  };

  const handleShowImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
    setSelectedImageUrl('');
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

  const formatSerie = (serie: string): string => {
    const serieMap: Record<string, string> = {
      '1ano': '1º Ano',
      '2ano': '2º Ano',
      '3ano': '3º Ano',
      '4ano': '4º Ano',
      '5ano': '5º Ano',
      '6ano': '6º Ano',
      '7ano': '7º Ano',
      '8ano': '8º Ano',
      '9ano': '9º Ano',
      '1medio': '1º Ano do Ensino Médio',
      '2medio': '2º Ano do Ensino Médio',
      '3medio': '3º Ano do Ensino Médio',
    };
    return serieMap[serie] || serie;
  };

  const formatTurma = (turma: string): string => {
    return turma.toUpperCase();
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  // Estatísticas
  const stats = {
    total: students.length,
    recent: students.filter(s => {
      const createdAt = new Date(s.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return createdAt >= oneWeekAgo;
    }).length,
    manha: students.filter(s => s.turno === 'manha').length,
    tarde: students.filter(s => s.turno === 'tarde').length,
    noite: students.filter(s => s.turno === 'noite').length,
    integral: students.filter(s => s.turno === 'integral').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in-up duration-500">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-6 gap-4 sm:gap-0">
            {/* Botão Página Principal */}
            <div className="flex items-center space-x-2 order-1 sm:order-1">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="text-white border-white/40 hover:bg-white/10 text-sm sm:text-base"
                icon={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
              >
                <span className="hidden sm:inline">Página Principal</span>
                <span className="sm:hidden">Início</span>
              </Button>
            </div>
            {/* Título Central com Ícone */}
            <div className="flex flex-col items-center order-2 sm:order-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse mb-2">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow text-center">Painel Administrativo</h1>
            </div>
            {/* Botão Sair */}
            <div className="flex items-center space-x-2 order-3 sm:order-3">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-white border-white/40 hover:bg-white/10 text-sm sm:text-base"
                icon={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                }
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Recentes</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.recent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Manhã</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.manha}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tarde</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.tarde}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Noite</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.noite}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Integral</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.integral}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Busca Modernos */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4 items-stretch sm:items-center">
              {/* Busca global */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nome, email, responsável, turma, série..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                  />
                </div>
              </div>
              {/* Filtros avançados */}
              <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
                {/* Turno */}
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  </svg>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="recent">Última Semana</option>
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                    <option value="integral">Integral</option>
                  </select>
                </div>
                {/* Status */}
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <button
                    type="button"
                    className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 ${selectedFilter === 'approved' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'}`}
                    onClick={() => setSelectedFilter('approved')}
                  >
                    Aprovados
                  </button>
                  <button
                    type="button"
                    className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 ${selectedFilter === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'}`}
                    onClick={() => setSelectedFilter('pending')}
                  >
                    Pendentes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Estudantes Responsiva */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Estudantes ({filteredStudents.length})
              </h2>
              <Button
                onClick={() => setShowModal(true)}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Adicionar Estudante
              </Button>
            </div>
          </div>

          {/* Mobile: Cards */}
          <div className="block md:hidden p-4 space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className={`rounded-xl shadow border p-4 flex flex-col gap-2 ${student.approved ? 'bg-green-50' : 'bg-white'}`}> 
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{student.nome.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                      {student.nome}
                      {student.approved && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-700 border border-green-200 ml-1 animate-pulse">Aprovado</span>
                      )}
                      {!student.approved && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-yellow-50 text-yellow-600 border border-yellow-200 ml-1">Pendente</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Responsável: {student.responsavel}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold">{formatSerie(student.serie)} - Turma {formatTurma(student.turma)}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded font-semibold ${student.turno === 'manha' ? 'bg-yellow-100 text-yellow-800' : student.turno === 'tarde' ? 'bg-orange-100 text-orange-800' : student.turno === 'noite' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'}`}>{student.turno.charAt(0).toUpperCase() + student.turno.slice(1)}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">{new Date(student.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => handleShowDetails(student)} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9a1 1 0 100-2 1 1 0 000 2z" /></svg>}>Ver Detalhes</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>Editar</Button>
                    <Button variant="outline" size="sm" onClick={() => { setStudentToDelete(student); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}>Excluir</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Tabela */}
          <div className="hidden md:block max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalhes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={`hover:bg-gray-50 transition-colors ${student.approved ? 'bg-green-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {student.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">{student.nome}</div>
                          {student.approved && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-700 border border-green-200 ml-1 animate-pulse">
                              Aprovado
                            </span>
                          )}
                          {!student.approved && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-yellow-50 text-yellow-600 border border-yellow-200 ml-1">
                              Pendente
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.telefone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="relative"
                        onMouseEnter={() => setExpandedTurma(student.id)}
                        onMouseLeave={() => setExpandedTurma(null)}
                      >
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 w-24 overflow-hidden">
                          <span className="truncate">
                            {formatSerie(student.serie)} - Turma {formatTurma(student.turma)}
                          </span>
                        </span>
                        
                        {/* Tooltip com animação fluída */}
                        <div 
                          className={`absolute z-10 top-0 left-0 bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold rounded-full shadow-lg transition-all duration-500 ease-out transform ${
                            expandedTurma === student.id 
                              ? 'opacity-100 scale-100 translate-y-0' 
                              : 'opacity-0 scale-95 translate-y-1 pointer-events-none'
                          }`}
                        >
                          {formatSerie(student.serie)} - Turma {formatTurma(student.turma)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.turno === 'manha' ? 'bg-yellow-100 text-yellow-800' :
                        student.turno === 'tarde' ? 'bg-orange-100 text-orange-800' :
                        student.turno === 'noite' ? 'bg-purple-100 text-purple-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {student.turno === 'manha' ? 'Manhã' :
                         student.turno === 'tarde' ? 'Tarde' :
                         student.turno === 'noite' ? 'Noite' : 'Integral'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowDetails(student)}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9a1 1 0 100-2 1 1 0 000 2z" />
                          </svg>
                        }
                      >
                        Ver Detalhes
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setStudentToDelete(student);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          }
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-[9997] p-4 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-slide-up">
            <StudentFormModal
              student={selectedStudent}
              onClose={handleModalClose}
              onSuccess={handleModalSuccess}
            />
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedStudentForDetails && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-[9997] p-4 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Detalhes do Estudante</h2>
                    <p className="text-sm text-gray-500">{selectedStudentForDetails.nome}</p>
                  </div>
                </div>
                <button
                  onClick={handleDetailsModalClose}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
                >
                  <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Informações Pessoais */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border-l-4 border-blue-500">Nome Completo</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{selectedStudentForDetails.nome}</p>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border-l-4 border-purple-500">Email</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{selectedStudentForDetails.email}</p>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-lg border-l-4 border-green-500">Telefone</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{selectedStudentForDetails.telefone}</p>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border-l-4 border-orange-500">Data de Nascimento</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">
                      {new Date(selectedStudentForDetails.dataNascimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border-l-4 border-indigo-500">Responsável</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{selectedStudentForDetails.responsavel}</p>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg border-l-4 border-pink-500">Pizza Preferida</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{selectedStudentForDetails.pizzaPreferida}</p>
                  </div>
                </div>
              </div>

              {/* Informações Acadêmicas */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
                  Informações Acadêmicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border-l-4 border-teal-500">Série</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{formatSerie(selectedStudentForDetails.serie)}</p>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg border-l-4 border-cyan-500">Turma</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{formatTurma(selectedStudentForDetails.turma)}</p>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border-l-4 border-emerald-500">Turno</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">
                      {selectedStudentForDetails.turno === 'manha' ? 'Manhã' :
                       selectedStudentForDetails.turno === 'tarde' ? 'Tarde' :
                       selectedStudentForDetails.turno === 'noite' ? 'Noite' : 'Integral'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {selectedStudentForDetails.endereco && (
                <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
                    Endereço
                  </h3>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border-l-4 border-amber-500">Endereço Completo</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{selectedStudentForDetails.endereco}</p>
                  </div>
                </div>
              )}

              {/* Observações */}
              {selectedStudentForDetails.observacoes && (
                <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
                    Observações
                  </h3>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border-l-4 border-rose-500">Informações Adicionais</label>
                    <p className="mt-2 text-sm text-gray-900 font-medium">{selectedStudentForDetails.observacoes}</p>
                  </div>
                </div>
              )}

              {/* Documento */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
                  Documento de Identidade
                </h3>
                <div>
                  {selectedStudentForDetails.documentosUrl ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-900">Documento anexado</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowImage(selectedStudentForDetails.documentosUrl!)}
                        className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        }
                      >
                        Visualizar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm text-gray-500">Nenhum documento anexado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data de Cadastro */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
                  Informações do Cadastro
                </h3>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <label className="block text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-lg border-l-4 border-violet-500">Data de Cadastro</label>
                  <p className="mt-2 text-sm text-gray-900 font-medium">
                    {new Date(selectedStudentForDetails.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(selectedStudentForDetails.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="px-6 py-4 border-t border-gray-200/50 flex justify-end flex-shrink-0 bg-white/95 backdrop-blur-md">
              <Button
                variant="outline"
                onClick={handleDetailsModalClose}
                className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização da Imagem */}
      {showImageModal && selectedImageUrl && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Visualizar Documento</h2>
                  <p className="text-sm text-gray-500">Documento de identidade do estudante</p>
                </div>
              </div>
              <button
                onClick={handleImageModalClose}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image Container - Scrollable */}
            <div className="p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-[400px] overflow-y-auto flex-1">
              <div className="relative max-w-full max-h-[70vh] overflow-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Image
                  src={selectedImageUrl}
                  alt="Documento de identidade"
                  className="max-w-full h-auto rounded-xl shadow-2xl border border-gray-200/50 transform hover:scale-105 transition-transform duration-500"
                  width={800}
                  height={600}
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-center p-8 text-gray-500';
                    errorDiv.innerHTML = `
                      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p class="text-lg font-medium">Erro ao carregar imagem</p>
                      <p class="text-sm">Não foi possível exibir o documento</p>
                    `;
                    target.parentNode?.appendChild(errorDiv);
                  }}
                />
              </div>
            </div>

            {/* Footer - Fixo */}
            <div className="px-6 py-4 border-t border-gray-200/50 flex justify-between items-center flex-shrink-0 bg-white/95 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Clique e arraste para ampliar a imagem</span>
              </div>
              <div className="flex space-x-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedImageUrl, '_blank')}
                  className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  }
                >
                  Abrir em Nova Aba
                </Button>
                <Button
                  variant="outline"
                  onClick={handleImageModalClose}
                  className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificações */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        title={notification.title}
      />

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && studentToDelete && (
        <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-pink-900/20 to-rose-900/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h2>
                <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Excluir estudante: <span className="font-bold">{studentToDelete.nome}</span>
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Email: {studentToDelete.email} | Turma: {formatTurma(studentToDelete.turma)}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Tem certeza que deseja excluir este estudante? Todos os dados e documentos associados serão removidos permanentemente.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200/50 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDeleteStudent(studentToDelete.id)}
                loading={loading}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                {loading ? 'Excluindo...' : 'Excluir Estudante'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});