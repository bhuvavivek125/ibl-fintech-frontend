import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface Language {
  languageId: string;
  languageName: string;
  _id: string;
}

export interface Designation {
  _id: string;
  name: string;
  description?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  designationId: Designation;
  parentDesignationId: string | null;
  languages: Language[];
  isActive: boolean;
  isIPRestrictionEnabled: boolean;
  isTimeRestrictionEnabled: boolean;
  lastLoginAt: string | null;
  lastLoginIP: string | null;
  ipWhitelist: string[];
  timeRestriction: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  } | null;
  loginAttempts: number;
  isLocked: boolean;
  lockedUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminUserListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminUser[];
}

export interface GetAdminUserDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminUser;
}
export interface TimeRestriction {
  isEnabled: boolean;
  startTime?: string;
  endTime?: string;
  timezone?: string;
}

export interface AddAdminUserPayload {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  designationId: string;
  languages?: string[];
  ipWhitelist?: string[];
  timeRestriction?: TimeRestriction;
  isAdmin?: boolean;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  password?: string;
  mobileNumber?: string;
  designationId?: string;
  languages?: string[];
  ipWhitelist?: string[];
  timeRestriction?: TimeRestriction;
  isAdmin?: boolean;
}

export interface ToggleUserStatusPayload {
  isActive: boolean;
}

export interface UserMenuPermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface UserPermissionItem {
  _id: string;
  permissions: UserMenuPermission;
  menu: {
    _id: string;
    name: string;
    path: string;
  };
}

export interface GetUserPermissionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: AdminUser;
    designationPermissions: Array<{
      _id: string;
      permissions: UserMenuPermission;
      menu: {
        _id: string;
        name: string;
        path: string;
      };
      isInherited: boolean;
    }>;
    userPermissions: UserPermissionItem[];
  };
}

export interface AssignUserPermissionRequest {
  menuId: string;
  permissions: UserMenuPermission;
}

export interface AssignUserPermissionResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface GenericResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getAdminUserList(page: number = 1, limit: number = 20) {
  try {
    const response = await axios.get<GetAdminUserListResponse>(API_ENDPOINTS.ADMIN_USERS.BASE, {
      params: { page, limit }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAdminUserDetail(id: string) {
  try {
    const response = await axios.get<GetAdminUserDetailResponse>(API_ENDPOINTS.ADMIN_USERS.DETAIL(id));
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function addAdminUser(payload: AddAdminUserPayload) {
  try {
    const response = await axios.post<GenericResponse>(API_ENDPOINTS.ADMIN_USERS.CREATE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateAdminUser(id: string, payload: UpdateAdminUserPayload) {
  try {
    const response = await axios.patch<GenericResponse>(API_ENDPOINTS.ADMIN_USERS.UPDATE(id), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function toggleAdminUserStatus(id: string, payload: ToggleUserStatusPayload) {
  try {
    const response = await axios.patch<GenericResponse>(API_ENDPOINTS.ADMIN_USERS.TOGGLE_STATUS(id), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteAdminUser(id: string) {
  try {
    const response = await axios.delete<GenericResponse>(API_ENDPOINTS.ADMIN_USERS.DELETE(id));
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserPermissions(userId: string) {
  try {
    const response = await axios.get<GetUserPermissionsResponse>(`${API_ENDPOINTS.ADMIN_USERS.BASE}/${userId}/permissions`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function assignUserPermission(userId: string, payload: AssignUserPermissionRequest) {
  try {
    const response = await axios.post<AssignUserPermissionResponse>(`${API_ENDPOINTS.ADMIN_USERS.BASE}/${userId}/permissions`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}
