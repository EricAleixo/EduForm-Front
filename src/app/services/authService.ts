import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

class AuthService {
  // Login de usuário
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  // Cadastro do primeiro administrador
  async signupAdmin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup-admin', credentials);
    return response.data;
  }

  // Obter perfil do usuário logado
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Obter token atual
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Salvar dados de autenticação
  saveAuthData(token: string, user: User): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Limpar dados de autenticação
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Verificar se o usuário é admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const authService = new AuthService(); 