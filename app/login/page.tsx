'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const authContext = useAuth();
  
  const [formData, setFormData] = useState({
    email: 'user@email.com', // Pré-preenchido para teste
    password: 'gui@123', // Pré-preenchido para teste
  });
  
  // Verificar se o contexto foi carregado após todos os hooks
  if (!authContext) {
    console.error('AuthContext não encontrado');
    return <div>Erro: AuthContext não disponível</div>;
  }
  
  const { login, loading, error, clearError, mounted } = authContext;

  // Aguardar hidratação para evitar problemas de SSR
  if (!mounted) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      clearError();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('LoginPage: Formulário submetido');
    
    // Validação simples
    if (!formData.email || !formData.password) {
      console.log('LoginPage: Email ou senha em branco');
      return false;
    }

    if (!login || typeof login !== 'function') {
      console.error('LoginPage: Login function not available');
      return false;
    }

    // Chamar login de forma assíncrona sem bloquear o form
    handleLogin();
    return false;
  };

  const handleLogin = async () => {
    try {
      if (!login || typeof login !== 'function') {
        return;
      }
      
      const success = await login(formData.email, formData.password);
      
      if (success) {
        router.push('/assunto');
      }
    } catch (err: any) {
      console.error('LoginPage: Erro no login:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Login
            </Typography>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Entre com suas credenciais para acessar o sistema
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !formData.email || !formData.password}
                onClick={handleLogin}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}