import { useContext } from 'react';
import AdminAuthContext from 'contexts/AdminAuthContext';

interface ModulePermissions {
  hasViewPermission: boolean;
  hasAddPermission: boolean;
  hasEditPermission: boolean;
  hasDeletePermission: boolean;
}

export const useModulePermissions = (moduleName: string): ModulePermissions => {
  const adminAuthContext = useContext(AdminAuthContext);

  // Extract permissions from AdminAuthContext
  const permissionsResponse: any = adminAuthContext?.permissions as any;
  const allPermissions = permissionsResponse?.data?.effectivePermissions;
  const modulePermissions = allPermissions?.find((p: any) => p.menuName === moduleName);

  return {
    hasViewPermission: modulePermissions?.permissions?.view ?? false,
    hasAddPermission: modulePermissions?.permissions?.add ?? false,
    hasEditPermission: modulePermissions?.permissions?.edit ?? false,
    hasDeletePermission: modulePermissions?.permissions?.delete ?? false
  };
};
