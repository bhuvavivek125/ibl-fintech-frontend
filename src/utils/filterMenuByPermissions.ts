import { NavItemType } from 'types';

/**
 * Filter menu items based on user permission slugs
 */
export const filterMenuByPermissions = (items: NavItemType[], userPermissions: string[]): NavItemType[] => {
  return items
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterMenuByPermissions(item.children, userPermissions)
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

        // Direct match
        const hasDirectAccess = userPermissions.some(up => up.trim().toLowerCase() === requiredPermission);
        if (hasDirectAccess) return true;

        // Partial match (e.g. if user has 'user' permission, they should see 'user.view')
        const basePermission = requiredPermission.split('.')[0];
        const hasBaseAccess = userPermissions.some(up => up.trim().toLowerCase() === basePermission);

        return hasBaseAccess;
      }

      // 3. Otherwise show it (e.g. items without explicit permission required)
      return true;
    });
};

/**
 * Extract permission slugs from user object (handles populated role)
 */
export const extractPermissionSlugs = (user: any): string[] => {
  if (!user) return [];

  let slugs: string[] = [];

  // 1. Check direct permissions array on user
  if (Array.isArray(user.permissions)) {
    slugs = user.permissions.map((p: any) => (typeof p === 'string' ? p : p.slug));
  }
  // 2. Check permissions inside the role object
  else if (user.role && typeof user.role === 'object' && Array.isArray(user.role.permissions)) {
    slugs = user.role.permissions.map((p: any) => (typeof p === 'string' ? p : p.slug));
  }
  // 3. Check for flattened permissions
  else if (user.rolePermissions && Array.isArray(user.rolePermissions)) {
    slugs = user.rolePermissions.map((p: any) => (typeof p === 'string' ? p : p.slug));
  }

  // Fallback for admin roles
  const roleValue = user.role;
  const roleName = (typeof roleValue === 'string' ? roleValue : roleValue?.slug || roleValue?.name || '').toLowerCase();

  if (['super_admin', 'admin', 'administrator'].includes(roleName)) {
    return ['dashboard.view', 'user.view', 'role.view', 'file.upload', 'settings.edit', 'user.create', 'user.edit', 'user.delete', 'activity.view'];
  }

  const finalSlugs = slugs.filter(Boolean).map(s => s.trim().toLowerCase());
  console.log('[RBAC] Active Slugs:', finalSlugs);
  return finalSlugs;
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: any, permission: string): boolean => {
  if (!user) return false;
  const slugs = extractPermissionSlugs(user);
  return slugs.includes(permission.trim().toLowerCase());
};
