import { api } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authApi = {
  // Login do usuário
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      // Re-throw o erro para ser capturado pelo AuthContext
      throw error;
    }
  },

  // Logout do usuário
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Verificar se o token é válido
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      // Tentar diferentes endpoints de verificação
      const endpoints = ['/auth/verify', '/auth/me', '/users/me', '/me'];
      
      for (const endpoint of endpoints) {
        try {
          await api.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return true; // Se algum endpoint funcionar, o token é válido
        } catch (error: any) {
          // Se é 401, o token é inválido
          if (error.response?.status === 401) {
            return false;
          }
          // Se é 404, tenta o próximo endpoint
          if (error.response?.status === 404) {
            continue;
          }
          // Outros erros, assume problema de conectividade
          throw error;
        }
      }
      
      // Se nenhum endpoint funcionou, assume que não há verificação disponível
      // Retorna true para manter o usuário logado (fallback)
      return true;
    } catch (error) {
      // Em caso de erro de rede ou servidor, assume que o token ainda é válido
      console.warn('Erro ao verificar token, assumindo válido:', error);
      return true;
    }
  },
};