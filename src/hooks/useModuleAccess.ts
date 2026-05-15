import { useContext } from 'react';
import AdminAuthContext from 'contexts/AdminAuthContext';
import { Permission, UserPermissionsResponse } from 'api/user-permissions';
import {
  canAccessModule,
  canPerformAction,
  getModuleCapabilities,
  getAccessibleModules
} from 'utils/permissionGuards';

interface UseModuleAccessReturn {
  permissions: Permission[] | null | undefined;
  canAccess: (moduleId: string) => boolean;
  canPerform: (moduleId: string, action: 'read' | 'write' | 'delete' | 'execute') => boolean;
  getCapabilities: (moduleId: string) => {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canExecute: boolean;
    hasAnyAccess: boolean;
  };
  getAccessibleModules: () => string[];
  hasPermissions: () => boolean;
}


export const useModuleAccess = (): UseModuleAccessReturn => {
  const adminAuth = useContext(AdminAuthContext);
  const permissionsResponse = adminAuth?.permissions as UserPermissionsResponse | undefined;
  const permissions = permissionsResponse?.effectivePermissions;

  return {
    permissions,
    canAccess: (moduleId: string) => canAccessModule(permissions, moduleId),
    canPerform: (moduleId: string, action: 'read' | 'write' | 'delete' | 'execute') =>
      canPerformAction(permissions, moduleId, action),
    getCapabilities: (moduleId: string) => getModuleCapabilities(permissions, moduleId),
    getAccessibleModules: () => getAccessibleModules(permissions),
    hasPermissions: () => !!(permissions && Array.isArray(permissions) && permissions.length > 0)
  };
};

export default useModuleAccess;;
