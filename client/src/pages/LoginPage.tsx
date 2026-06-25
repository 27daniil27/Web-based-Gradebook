import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Chip,
  alpha,
  InputAdornment,
  Divider,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useAuth } from '../context/AuthContext';
import { brand } from '../theme';

export default function LoginPage() {
  const [email, setEmail] = useState('teacher@gradebook.ru');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, #0f172a 0%, ${brand.blue} 40%, ${brand.violet} 70%, ${brand.pink} 100%)`,
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: alpha('#fff', 0.06),
          top: -100,
          left: -100,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: alpha('#fff', 0.04),
          bottom: -80,
          right: -60,
        }}
      />

      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          backdropFilter: 'blur(20px)',
          bgcolor: alpha('#fff', 0.95),
          border: `1px solid ${alpha('#fff', 0.3)}`,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
        className="animate-in"
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                mx: 'auto',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${brand.blue}, ${brand.violet})`,
                boxShadow: `0 8px 24px ${alpha(brand.blue, 0.4)}`,
              }}
            >
              <AutoStoriesIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
              GradeBook
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Электронный журнал · NestJS + React + PostgreSQL
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Пароль"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.4 }}>
                {loading ? 'Вход...' : 'Войти в систему'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 2.5 }}>
            <Typography variant="caption" color="text.secondary">
              Демо-аккаунты
            </Typography>
          </Divider>

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<SchoolIcon />}
              label="Преподаватель"
              clickable
              color="primary"
              variant="outlined"
              onClick={() => quickLogin('teacher@gradebook.ru')}
            />
            <Chip
              label="Студент"
              clickable
              color="secondary"
              variant="outlined"
              onClick={() => quickLogin('student1@gradebook.ru')}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block', textAlign: 'center' }}>
            Пароль для всех: password
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
