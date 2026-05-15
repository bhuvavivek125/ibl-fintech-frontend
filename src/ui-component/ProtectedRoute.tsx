import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminPermissions } from 'hooks/useAdminPermissions';
import Loader from 'ui-component/Loader';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  moduleId: string;
  requiredAction?: 'read' | 'write' | 'delete' | 'execute';
  unauthorizedRoute?: string;
  showLoader?: boolean;
  componentProps?: Record<string, any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  moduleId,
  requiredAction = 'read',
  unauthorizedRoute = '/access-denied',
  showLoader = true,
  componentProps = {}
}) => {
  const { hasAction, permissions } = useAdminPermissions();

  // Check if permissions are still loading
  if (!permissions && showLoader) {
    return <Loader />;
  }

  // Check if user has permission
  if (!hasAction(moduleId, requiredAction)) {
    console.warn(`[ProtectedRoute] Access denied - redirecting to ${unauthorizedRoute}`);
    return <Navigate to={unauthorizedRoute} replace />;
  }

  // Permission granted, render component
  return <Component {...componentProps} />;
};

export default ProtectedRoute;
