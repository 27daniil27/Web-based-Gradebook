import { Box, Typography, alpha } from '@mui/material';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, color = '#2563eb', icon }: StatCardProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: alpha(color, 0.15),
        background: `linear-gradient(145deg, ${alpha(color, 0.06)} 0%, ${alpha(color, 0.02)} 100%)`,
        minWidth: 140,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color }}>
        {value}
      </Typography>
    </Box>
  );
}
