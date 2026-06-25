import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useAuth } from '../context/AuthContext';
import { brand } from '../theme';

const DRAWER_WIDTH = 272;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  const isTeacher = user?.role === 'TEACHER';

  const links = isTeacher
    ? [
        { path: '/', label: 'Расписание', icon: <CalendarMonthIcon /> },
        { path: '/journal', label: 'Журнал', icon: <MenuBookIcon /> },
        { path: '/program', label: 'Программа', icon: <SchoolIcon /> },
        { path: '/submissions', label: 'Сдача лаб', icon: <AssignmentIcon /> },
      ]
    : [
        { path: '/', label: 'Расписание', icon: <CalendarMonthIcon /> },
        { path: '/journal', label: 'Электронный журнал', icon: <MenuBookIcon /> },
      ];

  const activeLink = links.find(
    (l) => location.pathname === l.path || (l.path !== '/' && location.pathname.startsWith(l.path)),
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2.5,
          background: `linear-gradient(135deg, ${brand.blue} 0%, ${brand.violet} 55%, ${brand.pink} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.1),
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: alpha('#fff', 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoStoriesIcon sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2 }}>
              GradeBook
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.85) }}>
              Электронный журнал
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1.5, pt: 2 }}>
        {links.map((l) => {
          const selected =
            location.pathname === l.path || (l.path !== '/' && location.pathname.startsWith(l.path));
          return (
            <ListItemButton
              key={l.path}
              selected={selected}
              onClick={() => {
                navigate(l.path);
                if (isMobile) setOpen(false);
              }}
              sx={{
                borderRadius: 2.5,
                mb: 0.75,
                py: 1.25,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: alpha(brand.blue, 0.12),
                  color: brand.blue,
                  '& .MuiListItemIcon-root': { color: brand.blue },
                  '&:hover': { bgcolor: alpha(brand.blue, 0.16) },
                },
                '&:hover': {
                  bgcolor: alpha(brand.slate, 0.04),
                  transform: 'translateX(2px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: selected ? brand.blue : 'text.secondary' }}>
                {l.icon}
              </ListItemIcon>
              <ListItemText
                primary={l.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: selected ? 700 : 500,
                    fontSize: '0.95rem',
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1.5,
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: alpha(brand.violet, 0.06),
          }}
        >
          <Avatar
            sx={{
              bgcolor: `linear-gradient(135deg, ${brand.violet}, ${brand.pink})`,
              width: 40,
              height: 40,
              fontWeight: 700,
            }}
          >
            {user?.firstName[0]}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
              {user?.lastName} {user?.firstName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {isTeacher ? 'Преподаватель' : user?.groupName}
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2.5,
            color: 'text.secondary',
            '&:hover': { bgcolor: alpha('#dc2626', 0.08), color: 'error.main' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 42 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Выйти" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: open ? `${DRAWER_WIDTH}px` : 0 },
          bgcolor: alpha('#fff', 0.85),
          backdropFilter: 'blur(12px)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: alpha(brand.slate, 0.08),
          transition: theme.transitions.create(['width', 'margin'], { duration: 225 }),
        }}
      >
        <Toolbar>
          <Tooltip title={open ? 'Скрыть меню' : 'Показать меню'}>
            <IconButton onClick={() => setOpen(!open)} edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
            {activeLink?.label ?? 'GradeBook'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            border: 'none',
            boxShadow: '4px 0 24px rgba(15, 23, 42, 0.06)',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          transition: theme.transitions.create(['width'], { duration: 225 }),
          backgroundImage: `
            radial-gradient(circle at 0% 0%, ${alpha(brand.blue, 0.05)} 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, ${alpha(brand.violet, 0.05)} 0%, transparent 50%)
          `,
        }}
      >
        <Box className="animate-in">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
