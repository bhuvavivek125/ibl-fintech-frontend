import React from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { gridSpacing } from 'store/constant';

interface PermissionGuardProps {
  hasViewPermission: boolean;
  moduleName: string;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  hasViewPermission,
  moduleName,
  children
}) => {
  if (!hasViewPermission) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid size={{ xs: 12 }}>
          <Alert severity="error">
            You don't have permission to view {moduleName}
          </Alert>
        </Grid>
      </Grid>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
