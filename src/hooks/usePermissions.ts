import { useEffect, useState } from 'react';
import { Permission, fetchUserPermissions, getAllowedModules, UserPermissionsResponse } from 'api/user-permissions';

interface UsePermissionsReturn {
  permissions: Permission[];
  allowedModules: string[];
  isLoading: boolean;
  error: string | null;
  hasPermission: (moduleId: string, action?: 'read' | 'write' | 'delete' | 'execute') => boolean;
}

export const usePermissions = (userId: string | undefined): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [allowedModules, setAllowedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setPermissions([]);
      setAllowedModules([]);
      return;
    }

    const loadPermissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response: UserPermissionsResponse = await fetchUserPermissions(userId);
        
        if (response.success && response.effectivePermissions) {
          setPermissions(response.effectivePermissions);
          setAllowedModules(getAllowedModules(response.effectivePermissions));
        } else {
          setError(response.message || 'Failed to fetch permissions');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching permissions';
        setError(errorMessage);
        console.error('Error fetching permissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [userId]);

  const hasPermission = (moduleId: string, action: 'read' | 'write' | 'delete' | 'execute' = 'read'): boolean => {
    if (!permissions || permissions.length === 0) {
      return false;
    }

    const permission = permissions.find((p) => p.menuName === moduleId);
    if (!permission) {
      return false;
    }

    // Map expected action to backend permission
    switch (action) {
      case 'read':
        return permission.permissions.view ?? false;
      case 'write':
        return (permission.permissions.add ?? false) || (permission.permissions.edit ?? false);
      case 'delete':
        return permission.permissions.delete ?? false;
      case 'execute':
        return permission.permissions.view ?? false;
      default:
        return false;
    }
  };

  return {
    permissions,
    allowedModules,
    isLoading,
    error,
    hasPermission
  };
};

export default usePermissions;
