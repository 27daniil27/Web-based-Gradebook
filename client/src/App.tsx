import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SchedulePage from './pages/SchedulePage';
import TeacherJournalPage from './pages/teacher/TeacherJournalPage';
import TeacherProgramPage from './pages/teacher/TeacherProgramPage';
import TeacherSubmissionsPage from './pages/teacher/TeacherSubmissionsPage';
import StudentJournalPage from './pages/student/StudentJournalPage';
import SubjectPage from './pages/student/SubjectPage';
import LabPage from './pages/student/LabPage';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function JournalRoute() {
  const { user } = useAuth();
  return user?.role === 'TEACHER' ? <TeacherJournalPage /> : <StudentJournalPage />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<SchedulePage />} />
        <Route path="/journal" element={<JournalRoute />} />
        <Route path="/program" element={user?.role === 'TEACHER' ? <TeacherProgramPage /> : <Navigate to="/" />} />
        <Route path="/submissions" element={user?.role === 'TEACHER' ? <TeacherSubmissionsPage /> : <Navigate to="/" />} />
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/lab/:id" element={<LabPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
