import { NavItemType } from 'types';

/**
 * Normalizes user permissions to a structured matrix object format:
 * permissions: { adminDashboard: { view: true, create: false... }, ... }
 */
export const getNormalizedPermissions = (user: any): any => {
  const defaultMatrix = {
    adminDashboard: { view: false, create: false, edit: false, delete: false },
    userManagement: { view: false, create: false, edit: false, delete: false },
    rolePermission: { view: false, create: false, edit: false, delete: false },
    fileUpload: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    activityLogs: { view: false, create: false, edit: false, delete: false }
  };

  if (!user) return defaultMatrix;

  const mapBackendKeyToFrontendKey = (key: string): string => {
    const mapping: { [key: string]: string } = {
      'Admin Dashboard': 'adminDashboard',
      'User Management': 'userManagement',
      'Role & Permission': 'rolePermission',
      'File Upload': 'fileUpload',
      'Settings': 'settings',
      'Activity Logs': 'activityLogs',
      'adminDashboard': 'adminDashboard',
      'userManagement': 'userManagement',
      'rolePermission': 'rolePermission',
      'fileUpload': 'fileUpload',
      'settings': 'settings',
      'activityLogs': 'activityLogs'
    };
    return mapping[key] || key;
  };

  const normalizeMatrixObject = (obj: any) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    const normalized = {
      adminDashboard: { view: false, create: false, edit: false, delete: false },
      userManagement: { view: false, create: false, edit: false, delete: false },
      rolePermission: { view: false, create: false, edit: false, delete: false },
      fileUpload: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
      activityLogs: { view: false, create: false, edit: false, delete: false }
    };
    Object.entries(obj).forEach(([key, val]) => {
      const frontendKey = mapBackendKeyToFrontendKey(key);
      if (frontendKey in normalized) {
        normalized[frontendKey as keyof typeof normalized] = {
          view: false,
          create: false,
          edit: false,
          delete: false,
          ...(val as any)
        };
      }
    });
    return normalized;
  };

  // If user is actually already a normalized matrix object passed in directly
  if (user.adminDashboard && typeof user.adminDashboard === 'object') {
    return { ...defaultMatrix, ...user };
  }

  const roleValue = user.role;
  const roleName = (typeof roleValue === 'string' ? roleValue : roleValue?.key || roleValue?.slug || roleValue?.name || '').toLowerCase();

  // Super admin has full permissions by default
  if (['super_admin', 'super-admin'].includes(roleName)) {
    return {
      adminDashboard: { view: true, create: true, edit: true, delete: true },
      userManagement: { view: true, create: true, edit: true, delete: true },
      rolePermission: { view: true, create: true, edit: true, delete: true },
      fileUpload: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: true, edit: true, delete: true },
      activityLogs: { view: true, create: true, edit: true, delete: true }
    };
  }

  // 1. Check if user.permissions is a structured matrix object
  if (user.permissions && typeof user.permissions === 'object' && !Array.isArray(user.permissions)) {
    return normalizeMatrixObject(user.permissions);
  }

  // 2. Check if user.role.permissions is a structured matrix object
  if (user.role && typeof user.role === 'object' && user.role.permissions && typeof user.role.permissions === 'object' && !Array.isArray(user.role.permissions)) {
    return normalizeMatrixObject(user.role.permissions);
  }

  // 3. Check if user.rolePermissions is a structured matrix object
  if (user.rolePermissions && typeof user.rolePermissions === 'object' && !Array.isArray(user.rolePermissions)) {
    return normalizeMatrixObject(user.rolePermissions);
  }

  // 4. Fallback for array permissions (legacy or overrides)
  let slugs: string[] = [];
  if (Array.isArray(user.permissions)) {
    slugs = user.permissions.map((p: any) => (typeof p === 'string' ? p : p.slug || p.name));
  } else if (user.role && typeof user.role === 'object' && Array.isArray(user.role.permissions)) {
    slugs = user.role.permissions.map((p: any) => (typeof p === 'string' ? p : p.slug || p.name));
  } else if (user.rolePermissions && Array.isArray(user.rolePermissions)) {
    slugs = user.rolePermissions.map((p: any) => (typeof p === 'string' ? p : p.slug || p.name));
  }

  if (slugs.length > 0) {
    const cleanSlugs = slugs.filter(Boolean).map((s) => s.trim().toLowerCase());
    const matrix = { ...defaultMatrix };

    // Admin Dashboard
    if (cleanSlugs.includes('dashboard.view') || cleanSlugs.includes('admin dashboard.view')) matrix.adminDashboard.view = true;

    // User Management
    if (cleanSlugs.includes('user.view') || cleanSlugs.includes('user management.view')) matrix.userManagement.view = true;
    if (cleanSlugs.includes('user.create') || cleanSlugs.includes('user management.create')) matrix.userManagement.create = true;
    if (cleanSlugs.includes('user.edit') || cleanSlugs.includes('user management.edit')) matrix.userManagement.edit = true;
    if (cleanSlugs.includes('user.delete') || cleanSlugs.includes('user management.delete')) matrix.userManagement.delete = true;

    // Role & Permission
    if (cleanSlugs.includes('role.view') || cleanSlugs.includes('role & permission.view')) matrix.rolePermission.view = true;
    if (cleanSlugs.includes('role.create') || cleanSlugs.includes('role & permission.create')) matrix.rolePermission.create = true;
    if (cleanSlugs.includes('role.edit') || cleanSlugs.includes('role & permission.edit')) matrix.rolePermission.edit = true;
    if (cleanSlugs.includes('role.delete') || cleanSlugs.includes('role & permission.delete')) matrix.rolePermission.delete = true;

    // File Upload
    if (cleanSlugs.includes('file.view') || cleanSlugs.includes('upload.view') || cleanSlugs.includes('file upload.view')) matrix.fileUpload.view = true;
    if (cleanSlugs.includes('file.upload') || cleanSlugs.includes('file.create') || cleanSlugs.includes('file upload.create')) matrix.fileUpload.create = true;
    if (cleanSlugs.includes('file.edit') || cleanSlugs.includes('file upload.edit')) matrix.fileUpload.edit = true;
    if (cleanSlugs.includes('file.delete') || cleanSlugs.includes('file upload.delete')) matrix.fileUpload.delete = true;

    // Settings
    if (cleanSlugs.includes('settings.view')) matrix.settings.view = true;
    if (cleanSlugs.includes('settings.create')) matrix.settings.create = true;
    if (cleanSlugs.includes('settings.edit')) matrix.settings.edit = true;
    if (cleanSlugs.includes('settings.delete')) matrix.settings.delete = true;

    // Activity Logs
    if (cleanSlugs.includes('activity.view') || cleanSlugs.includes('activity logs.view')) matrix.activityLogs.view = true;
    if (cleanSlugs.includes('activity.create') || cleanSlugs.includes('activity logs.create')) matrix.activityLogs.create = true;
    if (cleanSlugs.includes('activity.edit') || cleanSlugs.includes('activity logs.edit')) matrix.activityLogs.edit = true;
    if (cleanSlugs.includes('activity.delete') || cleanSlugs.includes('activity logs.delete')) matrix.activityLogs.delete = true;

    return matrix;
  }

  // Admin fallback
  if (['admin', 'administrator'].includes(roleName)) {
    return {
      adminDashboard: { view: true, create: true, edit: true, delete: false },
      userManagement: { view: true, create: true, edit: true, delete: false },
      rolePermission: { view: true, create: true, edit: true, delete: false },
      fileUpload: { view: true, create: true, edit: true, delete: false },
      settings: { view: true, create: true, edit: true, delete: false },
      activityLogs: { view: true, create: true, edit: true, delete: false }
    };
  }

  return defaultMatrix;
};

/**
 * Filter menu items based on user permissions matrix object or slugs array
 */
export const filterMenuByPermissions = (items: NavItemType[], permissionsArg: any): NavItemType[] => {
  // Gracefully normalize permissionsArg to the matrix object
  let userPermissionsMatrix = permissionsArg;
  if (Array.isArray(permissionsArg)) {
    // If it's a flat list of slugs, convert it using our mock user wrapper
    userPermissionsMatrix = getNormalizedPermissions({ permissions: permissionsArg });
  } else if (!permissionsArg || typeof permissionsArg !== 'object' || (!permissionsArg.adminDashboard && !permissionsArg.userManagement)) {
    // If it's a user object instead of a permissions object, resolve its permissions!
    userPermissionsMatrix = getNormalizedPermissions(permissionsArg);
  }

  return items
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterMenuByPermissions(item.children, userPermissionsMatrix)
        };
      }
      return item;
    })
    .filter((item) => {
      // 1. If it's a container (group/collapse) and has no children left after filtering, hide it
      const isContainer = item.type === 'group' || item.type === 'collapse';
      if (isContainer && (!item.children || item.children.length === 0)) {
        return false;
      }

      // 2. If it's an item and has a permission requirement, check if user has it
      if (item.type === 'item' && item.permission) {
        const requiredPermission = item.permission.trim().toLowerCase();
        
        let moduleKey = '';
        if (requiredPermission.startsWith('dashboard')) moduleKey = 'adminDashboard';
        else if (requiredPermission.startsWith('user')) moduleKey = 'userManagement';
        else if (requiredPermission.startsWith('role')) moduleKey = 'rolePermission';
        else if (requiredPermission.startsWith('file')) moduleKey = 'fileUpload';
        else if (requiredPermission.startsWith('settings')) moduleKey = 'settings';
        else if (requiredPermission.startsWith('activity')) moduleKey = 'activityLogs';

        if (moduleKey) {
          const state = userPermissionsMatrix[moduleKey];
          return state ? state.view === true : false;
        }
      }

      // 3. Otherwise show it
      return true;
    });
};

/**
 * Legacy support: Extract permission slugs as flat string array
 */
export const extractPermissionSlugs = (user: any): string[] => {
  const matrix = getNormalizedPermissions(user);
  const slugs: string[] = [];

  Object.entries(matrix).forEach(([moduleKey, state]: [string, any]) => {
    let moduleName = moduleKey;
    if (moduleKey === 'adminDashboard') moduleName = 'dashboard';
    if (moduleKey === 'userManagement') moduleName = 'user';
    if (moduleKey === 'rolePermission') moduleName = 'role';
    if (moduleKey === 'fileUpload') moduleName = 'file';
    if (moduleKey === 'activityLogs') moduleName = 'activity';

    if (state.view) slugs.push(`${moduleName}.view`);
    if (state.create) slugs.push(moduleName === 'file' ? 'file.upload' : `${moduleName}.create`);
    if (state.edit) slugs.push(`${moduleName}.edit`);
    if (state.delete) slugs.push(`${moduleName}.delete`);
  });

  return slugs;
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: any, permission: string): boolean => {
  if (!user) return false;
  const slugs = extractPermissionSlugs(user);
  return slugs.includes(permission.trim().toLowerCase());
};
