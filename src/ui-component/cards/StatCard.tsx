import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface StatCardProps {
  title: string;
  count: number;
  icon: string;
  percentage?: string;
  suffix?: string;
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
}

export default function StatCard({
  title,
  count,
  icon,
  percentage,
  suffix = '',
  color = 'primary'
}: StatCardProps) {
  const colorMap = {
    primary: '#1976d2',
    success: '#2e7d32',
    error: '#d32f2f',
    warning: '#f57c00',
    info: '#0288d1'
  };

  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        border: `1px solid #e0e0e0`,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          width: '100px',
          height: '100px',
          background: colorMap[color],
          borderRadius: '50%',
          opacity: 0.1,
          right: '-30px',
          top: '-30px'
        }
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666',
                mb: 1,
                fontWeight: 500
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: '28px',
                fontWeight: 700,
                color: colorMap[color],
                mb: 1
              }}
            >
              {count}
              {suffix}
            </Typography>
            {percentage && (
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#2e7d32',
                  fontWeight: 500
                }}
              >
                ↑ {percentage}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              fontSize: '32px',
              opacity: 0.7
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
