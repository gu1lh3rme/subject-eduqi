'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import AddItemModal from '@/components/AddItemModal';
import { useRouter } from 'next/navigation';

function AssuntoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

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
  return <AssuntoPage />;
}
