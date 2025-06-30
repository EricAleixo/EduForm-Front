import api from './api';

export interface Student {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  turma: string;
  serie: string;
  turno: string;
  responsavel: string;
  pizzaPreferida: string;
  endereco?: string;
  observacoes?: string;
  documentosUrl?: string;
  createdAt: string;
  updatedAt: string;
  approved: boolean;
}

export interface CreateStudentData {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  turma: string;
  serie: string;
  turno: string;
  responsavel: string;
  pizzaPreferida: string;
  endereco?: string;
  observacoes?: string;
  documentosUrl?: File;
  approved?: boolean;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  id: string;
}

class StudentService {
  // Listar todos os estudantes (admin)
  async getAllStudents(): Promise<Student[]> {
    const response = await api.get<Student[]>('/student');
    return response.data;
  }

  // Obter estudante específico (admin)
  async getStudent(id: string): Promise<Student> {
    const response = await api.get<Student>(`/student/${id}`);
    return response.data;
  }

  // Criar estudante (público - para inscrições)
  async createStudent(data: FormData): Promise<{ success: boolean; message: string; student?: Student }> {
    try {
      const response = await api.post<Student>('/student', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        message: 'Estudante cadastrado com sucesso!',
        student: response.data,
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Erro ao cadastrar estudante',
      };
    }
  }

  // Atualizar estudante (admin) - pode incluir dados e/ou documento
  async updateStudent(id: string, data: Partial<CreateStudentData> | FormData): Promise<Student> {
    const response = await api.patch<Student>(`/student/${id}`, data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  // Deletar estudante (admin)
  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/student/${id}`);
  }

  // Aprovar estudante (admin)
  async approveStudent(id: string): Promise<Student> {
    const response = await api.patch<Student>(`/student/${id}/approve`);
    return response.data;
  }
}

export const studentService = new StudentService(); 