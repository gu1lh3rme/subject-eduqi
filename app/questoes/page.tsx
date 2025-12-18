'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';

function QuestoesPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [refreshList, setRefreshList] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleQuestionCreated = () => {
    setRefreshList(true);
    setCurrentTab(1); 
  };

  const handleRefreshComplete = () => {
    setRefreshList(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Questões
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Cadastrar Questão" />
              <Tab label="Lista de Questões" />
            </Tabs>
          </Box>

          {currentTab === 0 && (
            <QuestionForm onSuccess={handleQuestionCreated} />
          )}

          {currentTab === 1 && (
            <QuestionList 
              refresh={refreshList} 
              onRefreshComplete={handleRefreshComplete}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default QuestoesPage;
