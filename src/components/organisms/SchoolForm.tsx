'use client';

import React, { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { FormSection } from '../molecules/FormSection';
import { Button } from '../atoms/Button';
import { Notification } from '../atoms/Notification';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  turma: string;
  serie: string;
  turno: string;
  responsavel: string;
  pizzaPreferida: string;
  endereco: string;
  observacoes: string;
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

export const SchoolForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIconFlying, setIsIconFlying] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.turma) {
      newErrors.turma = 'Turma é obrigatória';
    }

    if (!formData.serie) {
      newErrors.serie = 'Série é obrigatória';
    }

    if (!formData.turno) {
      newErrors.turno = 'Turno é obrigatório';
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Nome do responsável é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      type,
      message,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsIconFlying(true);

    try {
      // Simulate API call with random success/failure
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3; // 70% success rate

      if (isSuccess) {
        console.log('Form submitted:', formData);
        showNotification('success', 'Dados enviados com sucesso! Matrícula realizada.');
      } else {
        throw new Error('Erro na conexão com o servidor');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('error', 'Erro ao enviar dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
      // Reset icon animation after a delay
      setTimeout(() => {
        setIsIconFlying(false);
      }, 800);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Pessoais */}
        <FormSection
          title="Informações Pessoais"
          description="Dados básicos do estudante"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </FormSection>

        {/* Informações Acadêmicas */}
        <FormSection
          title="Informações Acadêmicas"
          description="Dados sobre a matrícula e curso"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </FormSection>

        {/* Informações Adicionais */}
        <FormSection
          title="Informações Adicionais"
          description="Dados complementares e observações"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          <div className="space-y-6">
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
              label="Escreva o sabor da sua pizza preferida"
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
          </div>
        </FormSection>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setFormData({
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
              });
              setErrors({});
            }}
          >
            Limpar Formulário
          </Button>

          <Button
            type="submit"
            loading={isSubmitting}
            icon={
              <svg
                className={`w-5 h-5 transition-all duration-300 ${isIconFlying ? 'animate-fly-up' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            }
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Matrícula'}
          </Button>
        </div>
      </form>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </>
  );
}; 