import React from 'react';
import { useAdminPermissions } from 'hooks/useAdminPermissions';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { IconAlertCircle, IconHome } from '@tabler/icons-react';

interface ProtectedModuleProps {
  moduleId: string;
  requiredAction?: 'read' | 'write' | 'delete' | 'execute';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showDefaultMessage?: boolean;
  debug?: boolean;
}

export const ProtectedModule: React.FC<ProtectedModuleProps> = ({
  moduleId,
  requiredAction = 'read',
  children,
  fallback,
  showDefaultMessage = true,
  debug = false
}) => {
  const { hasAction, permissions } = useAdminPermissions();
  const hasPermission = hasAction(moduleId, requiredAction);

  if (!hasPermission) {
    // If debug mode, show both error and content
    if (debug) {
      console.warn(`[ProtectedModule] Access denied for module: ${moduleId}, action: ${requiredAction}`);
      console.warn(`[ProtectedModule] Available permissions:`, permissions);
    }

    // Show custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show default access denied message
    if (showDefaultMessage) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 3
          }}
        >
          <Card elevation={0} sx={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <IconAlertCircle size={48} color="#ff6b6b" />
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Access Denied
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                You don't have permission to {requiredAction} this module ({moduleId}).
                <br />
                Please contact your administrator if you need access.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="outlined" onClick={() => window.history.back()} startIcon={<IconHome size={18} />}>
                  Go Back
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default ProtectedModule;
