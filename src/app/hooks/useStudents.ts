import { useState } from 'react';
import { studentService, Student, CreateStudentData } from '../services/studentService';
import { AxiosError } from 'axios';

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Criar estudante (para formulário público)
  const createStudent = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentService.createStudent(formData);
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Erro ao criar estudante'
        : 'Erro ao criar estudante';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Listar todos os estudantes (admin)
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Erro ao buscar estudantes'
        : 'Erro ao buscar estudantes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obter estudante específico (admin)
  const fetchStudent = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await studentService.getStudent(id);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Erro ao buscar estudante'
        : 'Erro ao buscar estudante';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar estudante (admin) - pode incluir dados e/ou documento
  const updateStudent = async (id: string, data: Partial<CreateStudentData> | FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedStudent = await studentService.updateStudent(id, data);
      setStudents(prev => prev.map(student => 
        student.id === id ? updatedStudent : student
      ));
      return updatedStudent;
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Erro ao atualizar estudante'
        : 'Erro ao atualizar estudante';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Deletar estudante (admin)
  const deleteStudent = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await studentService.deleteStudent(id);
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Erro ao deletar estudante'
        : 'Erro ao deletar estudante';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Aprovar estudante (admin)
  const approveStudent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedStudent = await studentService.approveStudent(id);
      setStudents(prev => prev.map(student => student.id === id ? updatedStudent : student));
      return updatedStudent;
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Erro ao aprovar estudante'
        : 'Erro ao aprovar estudante';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    students,
    error,
    createStudent,
    fetchStudents,
    fetchStudent,
    updateStudent,
    deleteStudent,
    approveStudent,
  };
}; 