'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  Avatar,
  Button,
  Stack,
} from '@mui/material';
import SubjectIcon from '@mui/icons-material/Subject';
import QuizIcon from '@mui/icons-material/Quiz';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 240;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const menuItems = [
    { text: 'Assunto', icon: <SubjectIcon />, path: '/assunto' },
    { text: 'Questões', icon: <QuizIcon />, path: '/questoes' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="primary">
          EduQi
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User info and logout */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        {user && (
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="body2" fontWeight="medium" noWrap>
                  {user.name}
                </Typography>
                {user.email && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                )}
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              disabled={loading}
              sx={{ justifyContent: 'flex-start' }}
            >
              Sair
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
