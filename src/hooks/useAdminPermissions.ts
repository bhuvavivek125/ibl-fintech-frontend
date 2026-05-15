import { useContext } from 'react';
import AdminAuthContext from 'contexts/AdminAuthContext';
import { Permission } from 'api/user-permissions';

interface UseAdminPermissionsReturn {
  permissions: Permission[] | null | undefined;
  isAdmin: boolean;
  hasModuleAccess: (moduleId: string) => boolean;
  hasAction: (moduleId: string, action: 'read' | 'write' | 'delete' | 'execute') => boolean;
}

export const useAdminPermissions = (): UseAdminPermissionsReturn => {
  const adminAuthContext = useContext(AdminAuthContext);

  const permissionsResponse:any = adminAuthContext?.permissions as any | undefined;
  const permissions = permissionsResponse?.data?.effectivePermissions;

  const hasModuleAccess = (moduleId: string): boolean => {
    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }
    return permissions.some((p) => p.menuName === moduleId);
  };

  const hasAction = (moduleId: string, action: 'read' | 'write' | 'delete' | 'execute' = 'read'): boolean => {
    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }

    // Find permission by menuName
    const permission = permissions.find((p) => p.menuName === moduleId);

    if (!permission) {
      return false;
    }

    let hasPermission = false;
    switch (action) {
      case 'read':
        hasPermission = permission.permissions.view ?? false;
        break;
      case 'write':
        hasPermission = (permission.permissions.add ?? false) || (permission.permissions.edit ?? false);
        break;
      case 'delete':
        hasPermission = permission.permissions.delete ?? false;
        break;
      case 'execute':
        hasPermission = permission.permissions.view ?? false;
        break;
      default:
        hasPermission = false;
    }

    return hasPermission;
  };

  return {
    permissions,
    isAdmin: adminAuthContext?.isLoggedIn ?? false,
    hasModuleAccess,
    hasAction
  };
};

export default useAdminPermissions;
