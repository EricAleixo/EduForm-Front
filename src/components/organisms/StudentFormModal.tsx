'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Notification } from '../atoms/Notification';
import { FormField } from '../molecules/FormField';
import { useStudents } from '@/app/hooks/useStudents';
import { Student, CreateStudentData } from '@/app/services/studentService';
import Image from 'next/image';

interface StudentFormModalProps {
  student?: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

const series = [
  { value: '1ano', label: '1º Ano' },
  { value: '2ano', label: '2º Ano' },
  { value: '3ano', label: '3º Ano' },
  { value: '4ano', label: '4º Ano' },
  { value: '5ano', label: '5º Ano' },
  { value: '6ano', label: '6º Ano' },
  { value: '7ano', label: '7º Ano' },
  { value: '8ano', label: '8º Ano' },
  { value: '9ano', label: '9º Ano' },
  { value: '1medio', label: '1º Ano do Ensino Médio' },
  { value: '2medio', label: '2º Ano do Ensino Médio' },
  { value: '3medio', label: '3º Ano do Ensino Médio' },
];

const turmas = [
  { value: 'a', label: 'Turma A' },
  { value: 'b', label: 'Turma B' },
  { value: 'c', label: 'Turma C' },
  { value: 'd', label: 'Turma D' },
  { value: 'e', label: 'Turma E' },
];

const turnos = [
  { value: 'manha', label: 'Manhã (7h às 12h)' },
  { value: 'tarde', label: 'Tarde (13h às 18h)' },
  { value: 'noite', label: 'Noite (19h às 22h)' },
  { value: 'integral', label: 'Integral (7h às 18h)' },
];

export const StudentFormModal: React.FC<StudentFormModalProps> = React.memo(function StudentFormModal({
  student,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState<CreateStudentData>({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    turma: '',
    serie: '',
    turno: '',
    responsavel: '',
    pizzaPreferida: '',
    endereco: '',
    observacoes: '',
    documentosUrl: undefined,
    approved: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateStudentData, string>>>({});
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

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  const { loading, updateStudent, createStudent, approveStudent } = useStudents();
  const isEditing = !!student;

  // Preencher formulário com dados do estudante se estiver editando
  useEffect(() => {
    if (student) {
      setFormData({
        nome: student.nome,
        email: student.email,
        telefone: student.telefone,
        dataNascimento: student.dataNascimento,
        turma: student.turma,
        serie: student.serie,
        turno: student.turno,
        responsavel: student.responsavel,
        pizzaPreferida: student.pizzaPreferida,
        endereco: student.endereco || '',
        observacoes: student.observacoes || '',
        documentosUrl: undefined,
        approved: student.approved,
      });
    }
  }, [student]);

  const handleFieldChange = (field: keyof CreateStudentData, value: string | File | boolean | null | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateStudentData, string>> = {};

    // Nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 letras';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(?\d{2}\)? ?9?\d{4}-?\d{4}$/.test(formData.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Telefone inválido. Use o formato (11) 99999-9999';
    }

    // Data de nascimento
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const data = new Date(formData.dataNascimento);
      const hoje = new Date();
      if (data > hoje) {
        newErrors.dataNascimento = 'Data de nascimento não pode ser futura';
      } else {
        const idade = hoje.getFullYear() - data.getFullYear();
        if (idade < 3) {
          newErrors.dataNascimento = 'Idade mínima: 3 anos';
        }
      }
    }

    // Turma
    if (!formData.turma) {
      newErrors.turma = 'Turma é obrigatória';
    }

    // Série
    if (!formData.serie) {
      newErrors.serie = 'Série é obrigatória';
    }

    // Turno
    if (!formData.turno) {
      newErrors.turno = 'Turno é obrigatório';
    }

    // Responsável
    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Nome do responsável é obrigatório';
    } else if (formData.responsavel.trim().length < 3) {
      newErrors.responsavel = 'Nome do responsável deve ter pelo menos 3 letras';
    }

    // Pizza preferida
    if (!formData.pizzaPreferida.trim()) {
      newErrors.pizzaPreferida = 'Pizza preferida é obrigatória';
    } else if (formData.pizzaPreferida.trim().length < 3) {
      newErrors.pizzaPreferida = 'Informe uma pizza válida';
    }

    // Documento (apenas na criação)
    if (!isEditing && !formData.documentosUrl) {
      newErrors.documentosUrl = 'Documento de identidade é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleShowImage = (url: string) => {
    setSelectedImageUrl(url);
    setShowImageModal(true);
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
    setSelectedImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && student) {
        // Se mudou de não aprovado para aprovado, chama approveStudent
        if (!student.approved && formData.approved) {
          await approveStudent(student.id);
          showNotification('success', 'Estudante aprovado com sucesso!', 'Aprovação Realizada');
        } else {
          // Atualização normal
          let updateData: Partial<CreateStudentData> | FormData;
          if (formData.documentosUrl instanceof File) {
            const formSubmit = new FormData();
            for (const key in formData) {
              const value = formData[key as keyof typeof formData];
              if (value !== undefined && value !== null) {
                if (key === 'documentosUrl' && value instanceof File) {
                  formSubmit.append('documentoIdentidade', value);
                } else if (key !== 'documentosUrl') {
                  formSubmit.append(key, String(value));
                }
              }
            }
            updateData = formSubmit;
          } else {
            // Se não há novo documento, usar JSON (sem o campo documentosUrl)
            const dataWithoutDocument = { ...formData };
            delete dataWithoutDocument.documentosUrl;
            updateData = dataWithoutDocument;
          }
          await updateStudent(student.id, updateData);
          showNotification('success', 'Estudante atualizado com sucesso!', 'Atualização Realizada');
        }
      } else {
        // Modo criação - criar novo estudante
        const formSubmit = new FormData();
        for (const key in formData) {
          const value = formData[key as keyof typeof formData];
          if (value !== undefined && value !== null) {
            if (key === 'documentosUrl' && value instanceof File) {
              formSubmit.append('documentoIdentidade', value);
            } else if (key !== 'documentosUrl') {
              formSubmit.append(key, String(value));
            }
          }
        }
        const result = await createStudent(formSubmit);
        if (result.success) {
          showNotification('success', 'Estudante criado com sucesso!', 'Criação Realizada');
        } else {
          showNotification('error', result.message, 'Erro na Criação');
          return;
        }
      }
      onSuccess();
    } catch (error: unknown) {
      console.error('Submit error:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 
        (isEditing ? 'Erro ao atualizar estudante' : 'Erro ao criar estudante');
      showNotification('error', errorMessage, isEditing ? 'Erro na Atualização' : 'Erro na Criação');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-[9997] p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Editar Estudante' : 'Adicionar Estudante'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? 'Atualize as informações do estudante' : 'Preencha os dados do novo estudante'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Informações Pessoais */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="text"
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={(value) => handleFieldChange('nome', value)}
                required
                error={errors.nome}
                placeholder="Digite o nome completo"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <FormField
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={(value) => handleFieldChange('email', value)}
                required
                error={errors.email}
                placeholder="exemplo@email.com"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <FormField
                type="tel"
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={(value) => handleFieldChange('telefone', value)}
                required
                error={errors.telefone}
                placeholder="(11) 99999-9999"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />

              <FormField
                type="date"
                label="Data de Nascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={(value) => handleFieldChange('dataNascimento', value)}
                required
                error={errors.dataNascimento}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Informações Acadêmicas */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
              Informações Acadêmicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                type="select"
                label="Série"
                name="serie"
                value={formData.serie}
                onChange={(value) => handleFieldChange('serie', value)}
                required
                error={errors.serie}
                options={series}
              />

              <FormField
                type="select"
                label="Turma"
                name="turma"
                value={formData.turma}
                onChange={(value) => handleFieldChange('turma', value)}
                required
                error={errors.turma}
                options={turmas}
              />

              <FormField
                type="select"
                label="Turno"
                name="turno"
                value={formData.turno}
                onChange={(value) => handleFieldChange('turno', value)}
                required
                error={errors.turno}
                options={turnos}
              />
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
              Informações Adicionais
            </h3>
            <div className="space-y-4">
              <FormField
                type="text"
                label="Nome do Responsável"
                name="responsavel"
                value={formData.responsavel}
                onChange={(value) => handleFieldChange('responsavel', value)}
                required
                error={errors.responsavel}
                placeholder="Nome completo do responsável"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <FormField
                type="text"
                label="Pizza Preferida"
                name="pizzaPreferida"
                value={formData.pizzaPreferida}
                onChange={(value) => handleFieldChange('pizzaPreferida', value)}
                required
                error={errors.pizzaPreferida}
                placeholder="Nome do sabor da pizza que você mais gosta"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L22 12L12 22C6.48 22 2 17.52 2 12S6.48 2 12 2Z" />
                    <circle cx="8" cy="8" r="1" fill="white" />
                    <circle cx="12" cy="6" r="1" fill="white" />
                    <circle cx="16" cy="8" r="1" fill="white" />
                    <circle cx="10" cy="12" r="1" fill="white" />
                    <circle cx="14" cy="12" r="1" fill="white" />
                  </svg>
                }
              />

              <FormField
                type="text"
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={(value) => handleFieldChange('endereco', value)}
                placeholder="Endereço completo"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />

              <FormField
                type="text"
                label="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={(value) => handleFieldChange('observacoes', value)}
                placeholder="Informações adicionais importantes"
                description="Informações sobre necessidades especiais, alergias, etc."
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />

              {isEditing && (
                <div className="flex items-center gap-3 mt-2">
                  <label className="font-medium text-gray-700 flex items-center cursor-pointer select-none">
                    <span className="mr-2">Aprovar matrícula</span>
                    <span className="relative">
                      <input
                        type="checkbox"
                        checked={!!formData.approved}
                        onChange={e => handleFieldChange('approved', e.target.checked)}
                        className="sr-only peer"
                      />
                      <span className={`w-6 h-6 inline-block rounded border-2 transition-colors duration-200
                        ${formData.approved ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}
                        flex items-center justify-center peer-focus:ring-2 peer-focus:ring-green-400`}
                      >
                        {formData.approved && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </span>
                    <span className={formData.approved ? 'ml-2 text-green-600 font-bold' : 'ml-2 text-yellow-600 font-bold'}>
                      {formData.approved ? 'Aprovado' : 'Pendente'}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Documentos */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200/50 pb-2">
              Documentos
            </h3>
            <div className="space-y-4">
              {/* Mostrar documento existente se estiver editando */}
              {isEditing && student?.documentosUrl && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-fade-in-up">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-green-800">Documento Atual</h4>
                        <p className="text-xs text-green-600">Documento de identidade já anexado</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowImage(student.documentosUrl!)}
                        className="text-green-600 border-green-300 hover:bg-green-50 transform hover:scale-105 transition-all duration-300"
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        }
                      >
                        Visualizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(student.documentosUrl, '_blank')}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        }
                      >
                        Nova Aba
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700">
                      Para trocar o documento, faça upload de um novo arquivo abaixo.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload de novo documento */}
              <div className={isEditing && student?.documentosUrl ? 'bg-blue-50 border border-blue-200 rounded-xl p-4' : ''}>
                <FormField
                  type="file"
                  label={isEditing && student?.documentosUrl ? "Novo Documento de Identidade" : "Documento de Identidade"}
                  name="documentoIdentidade"
                  value={formData.documentosUrl}
                  onChange={(value) => handleFieldChange('documentosUrl', value)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                  description={isEditing && student?.documentosUrl 
                    ? "Faça upload de um novo documento para substituir o atual. Formatos aceitos: PDF, JPG, PNG até 5MB"
                    : "RG, CPF ou certidão de nascimento. Formatos aceitos: PDF, JPG, PNG até 5MB"
                  }
                  onNotification={showNotification}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200/50 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Button
              variant="outline"
              onClick={onClose}
              className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              loading={loading}
              className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            >
              {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Estudante')}
            </Button>
          </div>
        </form>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        title={notification.title}
      />

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
    </div>
  );
}); 