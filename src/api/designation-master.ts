import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export type DesignationItem = {
  _id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isAdminDesignation?: boolean;
  permissions?: Array<{
    _id: string;
    permissions: {
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
    };
    menu: {
      _id: string;
      name: string;
      path: string;
      parentMenuId?: string | null;
    };
  }>;
};

export interface GetDesignationListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DesignationItem[];
}

export interface AddDesignationRequest {
  name: string;
  description?: string;
  isAdminDesignation?: boolean;
}

export interface AddDesignationResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface UpdateDesignationRequest {
  name?: string;
  description?: string;
  isAdminDesignation?: boolean;
}

export interface UpdateDesignationResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface DesignationMenuPermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface AssignPermissionRequest {
  menuId: string;
  permissions: DesignationMenuPermission;
}

export interface AssignPermissionResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface DeleteDesignationResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getDesignationList() {
  try {
    const response = await axios.get<GetDesignationListResponse>(API_ENDPOINTS.DESIGNATION_MASTER.BASE);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function addDesignation(payload: AddDesignationRequest) {
  try {
    const response = await axios.post<AddDesignationResponse>(API_ENDPOINTS.DESIGNATION_MASTER.BASE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateDesignation(designationId: string, payload: UpdateDesignationRequest) {
  try {
    const response = await axios.patch<UpdateDesignationResponse>(`${API_ENDPOINTS.DESIGNATION_MASTER.BASE}/${designationId}`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function assignDesignationPermissions(designationId: string, payload: AssignPermissionRequest) {
  try {
    const response = await axios.post<AssignPermissionResponse>(
      `${API_ENDPOINTS.DESIGNATION_MASTER.BASE}/${designationId}/permissions`,
      payload
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteDesignation(id: string) {
  try {
    const response = await axios.delete<DeleteDesignationResponse>(API_ENDPOINTS.DESIGNATION_MASTER.DELETE(id));
    return response.data;
  } catch (err) {
    throw err;
  }
}