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

  // 1. Check if user.permissions is already a structured matrix object
  if (user.permissions && typeof user.permissions === 'object' && !Array.isArray(user.permissions)) {
    return { ...defaultMatrix, ...user.permissions };
  }

  // 2. Check if user.rolePermissions is already a structured matrix object
  if (user.rolePermissions && typeof user.rolePermissions === 'object' && !Array.isArray(user.rolePermissions)) {
    return { ...defaultMatrix, ...user.rolePermissions };
  }

  // 3. Fallback for array permissions (legacy or overrides)
  let slugs: string[] = [];
  if (Array.isArray(user.permissions)) {
    slugs = user.permissions.map((p: any) => (typeof p === 'string' ? p : p.slug));
  } else if (user.role && typeof user.role === 'object' && Array.isArray(user.role.permissions)) {
    slugs = user.role.permissions.map((p: any) => (typeof p === 'string' ? p : p.slug));
  } else if (user.rolePermissions && Array.isArray(user.rolePermissions)) {
    slugs = user.rolePermissions.map((p: any) => (typeof p === 'string' ? p : p.slug));
  }

  if (slugs.length > 0) {
    const cleanSlugs = slugs.filter(Boolean).map((s) => s.trim().toLowerCase());
    const matrix = { ...defaultMatrix };

    // Admin Dashboard
    if (cleanSlugs.includes('dashboard.view')) matrix.adminDashboard.view = true;

    // User Management
    if (cleanSlugs.includes('user.view')) matrix.userManagement.view = true;
    if (cleanSlugs.includes('user.create')) matrix.userManagement.create = true;
    if (cleanSlugs.includes('user.edit')) matrix.userManagement.edit = true;
    if (cleanSlugs.includes('user.delete')) matrix.userManagement.delete = true;

    // Role & Permission
    if (cleanSlugs.includes('role.view')) matrix.rolePermission.view = true;
    if (cleanSlugs.includes('role.create')) matrix.rolePermission.create = true;
    if (cleanSlugs.includes('role.edit')) matrix.rolePermission.edit = true;
    if (cleanSlugs.includes('role.delete')) matrix.rolePermission.delete = true;

    // File Upload
    if (cleanSlugs.includes('file.view') || cleanSlugs.includes('upload.view')) matrix.fileUpload.view = true;
    if (cleanSlugs.includes('file.upload') || cleanSlugs.includes('file.create')) matrix.fileUpload.create = true;
    if (cleanSlugs.includes('file.edit')) matrix.fileUpload.edit = true;
    if (cleanSlugs.includes('file.delete')) matrix.fileUpload.delete = true;

    // Settings
    if (cleanSlugs.includes('settings.view')) matrix.settings.view = true;
    if (cleanSlugs.includes('settings.create')) matrix.settings.create = true;
    if (cleanSlugs.includes('settings.edit')) matrix.settings.edit = true;
    if (cleanSlugs.includes('settings.delete')) matrix.settings.delete = true;

    // Activity Logs
    if (cleanSlugs.includes('activity.view')) matrix.activityLogs.view = true;
    if (cleanSlugs.includes('activity.create')) matrix.activityLogs.create = true;
    if (cleanSlugs.includes('activity.edit')) matrix.activityLogs.edit = true;
    if (cleanSlugs.includes('activity.delete')) matrix.activityLogs.delete = true;

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
