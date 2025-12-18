'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Link as MuiLink,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const authContext = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
  // Verificar se o contexto foi carregado após todos os hooks
  if (!authContext) {
    console.error('AuthContext não encontrado');
    return <div>Erro: AuthContext não disponível</div>;
  }
  
  const { register, loading, error, clearError, mounted, isAuthenticated } = authContext;

  // Redirecionar se o usuário já estiver autenticado
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/assunto');
    }
  }, [mounted, isAuthenticated, router]);

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

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Email deve ter um formato válido';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    if (field === 'password' && validationErrors.confirmPassword) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: '',
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    
    if (!validateForm()) {
      console.log('RegisterPage: Validação falhou');
      return false;
    }

    if (!register || typeof register !== 'function') {
      console.error('RegisterPage: Register function not available');
      return false;
    }

    handleRegister();
    return false;
  };

  const handleRegister = async () => {
    try {
      if (!register || typeof register !== 'function') {
        return;
      }
      
      const success = await register(formData.name, formData.email, formData.password);
      
      if (success) {
        router.push('/assunto');
      }
    } catch (err: any) {
      console.error('RegisterPage: Erro no registro:', err);
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
              Criar Conta
            </Typography>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Preencha os dados abaixo para criar sua conta
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
                id="name"
                label="Nome Completo"
                name="name"
                type="text"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
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
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                disabled={loading}
              />
              
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
                onClick={handleRegister}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Já tem uma conta?{' '}
                  <Link href="/login" passHref>
                    <MuiLink component="span" sx={{ cursor: 'pointer' }}>
                      Faça login aqui
                    </MuiLink>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}