import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

// assets
import { IconAlertTriangle, IconHome, IconArrowLeft } from '@tabler/icons-react';

interface AccessDeniedPageProps {
  message?: string;
  description?: string;
  showDetails?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  message = 'Access Denied',
  description = 'You do not have permission to access this resource. Please contact your administrator if you believe this is a mistake.',
  onAction
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoBack = () => {
    if (onAction) {
      onAction();
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
            {/* Icon */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '50%',
                  backgroundColor: '#fff5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconAlertTriangle size={56} color="#ff6b6b" stroke={1.5} />
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              {message}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{
                mb: 3,
                lineHeight: 1.8
              }}
            >
              {description}
            </Typography>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconHome size={18} />}
                onClick={handleGoHome}
                sx={{ minWidth: 160 }}
              >
                Dashboard
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<IconArrowLeft size={18} />}
                onClick={handleGoBack}
                sx={{ minWidth: 160 }}
              >
                Go Back
              </Button>
            </Stack>

            {/* Footer */}
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                display: 'block',
                mt: 4
              }}
            >
              If this seems like a mistake, please contact support or your system administrator.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AccessDeniedPage;
