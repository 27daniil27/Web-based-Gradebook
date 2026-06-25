import { createTheme, alpha, type Theme } from '@mui/material/styles';

const brand = {
  blue: '#2563eb',
  violet: '#7c3aed',
  pink: '#db2777',
  slate: '#0f172a',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: brand.blue, light: '#60a5fa', dark: '#1d4ed8' },
    secondary: { main: brand.violet, light: '#a78bfa', dark: '#6d28d9' },
    success: { main: '#16a34a', light: '#dcfce7' },
    warning: { main: '#f59e0b', light: '#fef3c7' },
    error: { main: '#dc2626', light: '#fee2e2' },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: brand.slate,
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 1px 2px rgba(15, 23, 42, 0.04)',
    '0 4px 12px rgba(15, 23, 42, 0.06)',
    '0 8px 24px rgba(15, 23, 42, 0.08)',
    '0 12px 32px rgba(15, 23, 42, 0.1)',
    ...Array(20).fill('0 12px 32px rgba(15, 23, 42, 0.1)'),
  ] as Theme['shadows'],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(brand.blue, 0.3)} transparent`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          background: `linear-gradient(135deg, ${brand.blue}, ${brand.violet})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${brand.blue}, ${brand.pink})`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid',
          borderColor: alpha(brand.slate, 0.08),
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 28px rgba(15, 23, 42, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid',
          borderColor: alpha(brand.slate, 0.08),
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid',
          borderColor: alpha(brand.slate, 0.08),
        },
      },
    },
  },
});

export { brand };
