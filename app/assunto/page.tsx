'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  ThemeProvider,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import theme from '@/contexts/theme';
import Sidebar from '@/components/Sidebar';
import AddItemModal from '@/components/AddItemModal';
import { useRouter } from 'next/navigation';

function AssuntoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const { logout } = useAuth();
  const router = useRouter();

  const handleAddItem = (name: string) => {
    setItems([...items, name]);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Assunto
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Lista de Assuntos</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setModalOpen(true)}
              >
                Adicionar Assunto
              </Button>
            </Box>
            {items.length === 0 ? (
              <Typography color="text.secondary">
                Nenhum assunto cadastrado. Clique em "Adicionar Assunto" para começar.
              </Typography>
            ) : (
              <Box>
                {items.map((item, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }} elevation={1}>
                    <Typography>{item}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Container>
        <AddItemModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddItem}
          title="Adicionar Novo Assunto"
        />
      </Box>
    </Box>
  );
}

export default function Page() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AssuntoPage />
      </AuthProvider>
    </ThemeProvider>
  );
}
