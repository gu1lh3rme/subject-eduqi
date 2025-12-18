import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Só adicionar token se estivermos no cliente
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Comentar temporariamente para debug
    // Se for erro 401 (não autorizado), limpar autenticação
    // if (error.response?.status === 401) {
    //   // Só limpar se não for durante a verificação inicial do token
    //   if (!error.config.url?.includes('/verify') && !error.config.url?.includes('/me')) {
    //     localStorage.removeItem('authToken');
    //     localStorage.removeItem('user');
    //     document.cookie = 'authToken=; path=/; max-age=0';
        
    //     // Redirecionar para login apenas se não estiver já na página de login
    //     if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    //       window.location.href = '/login';
    //     }
    //   }
    // }
    
    return Promise.reject(error);
  }
);

export default api;