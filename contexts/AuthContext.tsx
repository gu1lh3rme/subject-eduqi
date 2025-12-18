'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi, LoginRequest, RegisterRequest } from '@/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  mounted: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const initializeAuth = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        
        // Se temos tanto token quanto dados do usuário, considerar autenticado
        if (token && savedUser) {
          setIsAuthenticated(true);
          setUser(JSON.parse(savedUser));
        } else {
          // Não há dados salvos, usuário não autenticado
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao ler dados de autenticação:', error);
        // Em caso de erro ao parsear, limpar tudo
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        document.cookie = 'authToken=; path=/; max-age=0';
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login({ email: email.trim(), password: password.trim() });
      
      if (!response.access_token) {
        throw new Error('Token não recebido na resposta');
      }

      // Salvar dados (apenas no cliente)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('authToken', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          document.cookie = `authToken=${response.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        } catch (storageError) {
          console.warn('Erro ao salvar no localStorage:', storageError);
        }
      }
      
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
      
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
      } else if (error.response?.status === 401) {
        const backendMessage = error.response?.data?.message || error.response?.data?.error;
        errorMessage = backendMessage || 'Email ou senha incorretos.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Serviço de login não encontrado.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor.';
      }
      
      setError(errorMessage);
      return false;
      
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register({ 
        name: name.trim(), 
        email: email.trim(), 
        password: password.trim() 
      });
      
      if (!response.access_token) {
        throw new Error('Token não recebido na resposta');
      }

      // Salvar dados (apenas no cliente)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('authToken', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          document.cookie = `authToken=${response.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        } catch (storageError) {
          console.warn('Erro ao salvar no localStorage:', storageError);
        }
      }
      
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
      
    } catch (error: any) {
      let errorMessage = 'Erro ao criar conta';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
      } else if (error.response?.status === 400) {
        const backendMessage = error.response?.data?.message || error.response?.data?.error;
        errorMessage = backendMessage || 'Dados inválidos. Verifique os campos preenchidos.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Este email já está em uso. Tente outro email.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Serviço de registro não encontrado.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor.';
      }
      
      setError(errorMessage);
      return false;
      
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpar dados locais independentemente do resultado da API (apenas no cliente)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Limpar cookie
        document.cookie = 'authToken=; path=/; max-age=0';
      }
      
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      error,
      mounted,
      login,
      register, 
      logout, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
