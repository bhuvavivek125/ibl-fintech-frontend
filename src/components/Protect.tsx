import React from 'react';
import useRBAC from 'hooks/useRBAC';

interface ProtectProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Protect: React.FC<ProtectProps> = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useRBAC();
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
};

export default Protect;
