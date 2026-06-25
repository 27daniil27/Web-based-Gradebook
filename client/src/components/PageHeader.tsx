import { Box, Typography, alpha } from '@mui/material';
import { brand } from '../theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
        p: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(brand.blue, 0.08)} 0%, ${alpha(brand.violet, 0.06)} 100%)`,
        border: '1px solid',
        borderColor: alpha(brand.blue, 0.12),
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ mb: subtitle ? 0.5 : 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" variant="body1">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
