import { NavItemType } from 'types';
import { Permission } from 'api/user-permissions';

export const filterMenuByPermissions = (items: NavItemType[], allowedModules: Set<string>): NavItemType[] => {
  return items
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByPermissions(item.children, allowedModules) : undefined
    }))
    .filter((item) => {
      const isContainer = item.type === 'group' || item.type === 'collapse';

      if (item.children && item.children.length > 0) {
        return true;
      }

      if (isContainer) {
        return false;
      }

      if (!item.id) {
        return true;
      }

      return allowedModules.has(item.id);
    });
};

export const createAllowedModulesSet = (permissions: Permission[]): Set<string> => {
  return new Set(
    permissions
      .filter((p) => {
        return p.permissions.view || p.permissions.add || p.permissions.edit || p.permissions.delete;
      })
      .map((p) => p.menuName)
  );
};

export const filterSingleMenuGroup = (menuGroup: NavItemType, allowedModules: Set<string>): NavItemType | null => {
  const filtered: NavItemType = {
    ...menuGroup,
    children: menuGroup.children ? filterMenuByPermissions(menuGroup.children, allowedModules) : undefined
  };

  if (filtered.type === 'collapse' && filtered.children && filtered.children.length > 0) {
    return filtered;
  }

  if (filtered.type === 'item' && filtered.id && allowedModules.has(filtered.id)) {
    return filtered;
  }

  if (filtered.type === 'group' && filtered.children && filtered.children.length > 0) {
    return filtered;
  }

  return null;
};
