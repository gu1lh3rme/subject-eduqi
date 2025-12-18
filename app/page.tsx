'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function HomePage() {
  const { isAuthenticated, loading, mounted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (mounted && !loading) {
      if (isAuthenticated) {
        // Se autenticado, redirecionar para a página principal
        router.push('/assunto');
      } else {
        // Se não autenticado, redirecionar para login apenas após um pequeno delay
        // para evitar redirecionamento durante a verificação inicial
        const timer = setTimeout(() => {
          router.push('/login');
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, loading, mounted, router]);

  // Mostrar loading enquanto verifica autenticação ou aguarda hidratação
  if (!mounted || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          {!mounted ? 'Carregando...' : 'Verificando autenticação...'}
        </Typography>
      </Box>
    );
  }

  // Este return não será executado devido aos redirecionamentos
  return null;
}
