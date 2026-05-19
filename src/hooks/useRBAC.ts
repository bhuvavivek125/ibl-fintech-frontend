import useAuth from './useAuth';
import { getNormalizedPermissions } from 'utils/filterMenuByPermissions';

export const useRBAC = () => {
  const { user } = useAuth();
  const permissions = getNormalizedPermissions(user);

  const roleValue = user?.role as any;
  const isSuperAdmin = (
    roleValue === 'super_admin' ||
    roleValue?.key === 'super_admin' ||
    roleValue?.slug === 'super_admin'
  );

  const checkPermission = (requiredPermission: string): boolean => {
    if (isSuperAdmin) return true;

    const [moduleName, actionName] = requiredPermission.trim().toLowerCase().split('.');
    
    let moduleKey = moduleName;
    if (moduleName === 'dashboard') moduleKey = 'adminDashboard';
    else if (moduleName === 'role') moduleKey = 'rolePermission';
    else if (moduleName === 'file') moduleKey = 'fileUpload';
    else if (moduleName === 'activity') moduleKey = 'activityLogs';

    const state = permissions[moduleKey as keyof typeof permissions];
    if (state) {
      const act = actionName === 'upload' ? 'create' : actionName;
      return state[act as keyof typeof state] === true;
    }
    return false;
  };

  return {
    permissions,
    hasPermission: checkPermission,
    canView: (module: string) => {
      if (isSuperAdmin) return true;

      let key = module;
      if (module === 'user') key = 'userManagement';
      else if (module === 'role') key = 'rolePermission';
      else if (module === 'file') key = 'fileUpload';
      else if (module === 'activity') key = 'activityLogs';
      else if (module === 'dashboard') key = 'adminDashboard';

      const state = permissions[key as keyof typeof permissions];
      return state ? state.view === true : false;
    },
    canCreate: (module: string) => {
      if (isSuperAdmin) return true;

      let key = module;
      if (module === 'user') key = 'userManagement';
      else if (module === 'role') key = 'rolePermission';
      else if (module === 'file') key = 'fileUpload';
      else if (module === 'activity') key = 'activityLogs';
      else if (module === 'dashboard') key = 'adminDashboard';

      const state = permissions[key as keyof typeof permissions];
      return state ? state.create === true : false;
    },
    canEdit: (module: string) => {
      if (isSuperAdmin) return true;

      let key = module;
      if (module === 'user') key = 'userManagement';
      else if (module === 'role') key = 'rolePermission';
      else if (module === 'file') key = 'fileUpload';
      else if (module === 'activity') key = 'activityLogs';
      else if (module === 'dashboard') key = 'adminDashboard';

      const state = permissions[key as keyof typeof permissions];
      return state ? state.edit === true : false;
    },
    canDelete: (module: string) => {
      if (isSuperAdmin) return true;

      let key = module;
      if (module === 'user') key = 'userManagement';
      else if (module === 'role') key = 'rolePermission';
      else if (module === 'file') key = 'fileUpload';
      else if (module === 'activity') key = 'activityLogs';
      else if (module === 'dashboard') key = 'adminDashboard';

      const state = permissions[key as keyof typeof permissions];
      return state ? state.delete === true : false;
    }
  };
};

export default useRBAC;
