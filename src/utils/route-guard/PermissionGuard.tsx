import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// project imports
import useAuth from 'hooks/useAuth';
import { extractPermissionSlugs } from 'utils/filterMenuByPermissions';
import { GuardProps } from 'types';

interface PermissionGuardProps extends GuardProps {
  permission: string;
}

/**
 * Permission guard for routes
 * @param {PermissionGuardProps} props 
 */
export default function PermissionGuard({ children, permission }: PermissionGuardProps) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const userPermissions = extractPermissionSlugs(user);
  const hasPermission = userPermissions.includes(permission.toLowerCase());

  useEffect(() => {
    if (isLoggedIn && !hasPermission) {
      navigate('/access-denied', { replace: true });
    }
  }, [isLoggedIn, hasPermission, navigate]);

  return hasPermission ? children : null;
}
