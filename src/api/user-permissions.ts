export interface Permission {
  menuId: string;
  menuName: string;
  menuLabel: string;
  menuPath: string;
  parentMenuId: string | null;
  permissions: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
  isOverridden: boolean;
}

export interface UserPermissionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  designationId: string;
  userId: string;
  userName: string;
  effectivePermissions: Permission[];
}

export const fetchUserPermissions = async (userId: string): Promise<UserPermissionsResponse> => {
  return {
    success: true,
    statusCode: 200,
    message: 'Success',
    designationId: '',
    userId: userId,
    userName: '',
    effectivePermissions: []
  };
};

export const getAllowedModules = (permissions: Permission[]): string[] => {
  return [];
};
