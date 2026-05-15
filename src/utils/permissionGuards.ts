import { Permission, UserPermissionsResponse } from 'api/user-permissions';

export const canAccessModule = (permissions: Permission[] | UserPermissionsResponse | null | undefined, moduleId: string): boolean => {
  const permArray = extractPermissionArray(permissions);
  if (!permArray) {
    return false;
  }
  return permArray.some(
    (p) => p.menuName === moduleId && (p.permissions.view || p.permissions.add || p.permissions.edit || p.permissions.delete)
  );
};

export const canPerformAction = (
  permissions: Permission[] | UserPermissionsResponse | null | undefined,
  moduleId: string,
  action: 'read' | 'write' | 'delete' | 'execute' = 'read'
): boolean => {
  const permArray = extractPermissionArray(permissions);
  if (!permArray) {
    return false;
  }

  const permission = permArray.find((p) => p.menuName === moduleId);
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

const extractPermissionArray = (permissions: Permission[] | UserPermissionsResponse | null | undefined): Permission[] | null => {
  if (!permissions) {
    return null;
  }

  if (Array.isArray(permissions)) {
    return permissions;
  }

  // If it's a response object, extract effectivePermissions
  if ('effectivePermissions' in permissions && Array.isArray(permissions.effectivePermissions)) {
    return permissions.effectivePermissions;
  }

  return null;
};

export const getModulePermission = (
  permissions: Permission[] | UserPermissionsResponse | null | undefined,
  moduleId: string
): Permission | null => {
  const permArray = extractPermissionArray(permissions);
  if (!permArray) {
    return null;
  }
  return permArray.find((p) => p.menuName === moduleId) ?? null;
};

export const getModuleCapabilities = (permissions: Permission[] | UserPermissionsResponse | null | undefined, moduleId: string) => {
  const permission = getModulePermission(permissions, moduleId);

  return {
    canRead: permission?.permissions.view ?? false,
    canWrite: (permission?.permissions.add ?? false) || (permission?.permissions.edit ?? false),
    canDelete: permission?.permissions.delete ?? false,
    canExecute: permission?.permissions.view ?? false,
    hasAnyAccess: !!(
      permission?.permissions.view ||
      permission?.permissions.add ||
      permission?.permissions.edit ||
      permission?.permissions.delete
    )
  };
};

export const getAccessibleModules = (permissions: Permission[] | UserPermissionsResponse | null | undefined): string[] => {
  const permArray = extractPermissionArray(permissions);
  if (!permArray) {
    return [];
  }
  return permArray
    .filter((p) => p.permissions.view || p.permissions.add || p.permissions.edit || p.permissions.delete)
    .map((p) => p.menuName);
};

export const hasAnyPermission = (permissions: Permission[] | UserPermissionsResponse | null | undefined): boolean => {
  const permArray = extractPermissionArray(permissions);
  return !!(permArray && permArray.length > 0);
};

export const filterModulesByPermission = (
  permissions: Permission[] | UserPermissionsResponse | null | undefined,
  moduleIds: string[],
  requiredAction: 'read' | 'write' | 'delete' | 'execute' = 'read'
): string[] => {
  const permArray = extractPermissionArray(permissions);
  if (!permArray) {
    return [];
  }
  return moduleIds.filter((moduleId) => canPerformAction(permArray, moduleId, requiredAction));
};

export const createPermissionGuard = (moduleId: string, requiredAction: 'read' | 'write' | 'delete' | 'execute' = 'read') => {
  return (permissions: Permission[] | null | undefined): boolean => {
    return canPerformAction(permissions, moduleId, requiredAction);
  };
};

export const requirePermission = (
  permissions: Permission[] | null | undefined,
  moduleId: string,
  action: 'read' | 'write' | 'delete' | 'execute' = 'read'
): void => {
  if (!canPerformAction(permissions, moduleId, action)) {
    throw new Error(`Permission denied: ${action} action not allowed on ${moduleId} module`);
  }
};

export const isValidPermissions = (permissions: any): permissions is Permission[] => {
  return Array.isArray(permissions) && permissions.length > 0;
};
