import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

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
  try {
    const response = await axios.get(API_ENDPOINTS.ADMIN_USERS.PERMISSIONS(userId));
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch permissions for user ${userId}:`, error);
    throw error;
  }
};

export const getAllowedModules = (permissions: Permission[]): string[] => {
  return permissions
    .filter((p) => p.permissions.view || p.permissions.add || p.permissions.edit || p.permissions.delete)
    .map((p) => p.menuName);
};
