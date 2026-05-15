import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export type AdminMenuItem = {
  _id: string;
  name: string;
  displayOrder?: number;
  icon?: string | null;
  isActive?: boolean;
  label: string;
  parentMenuId?: string | null;
  path?: string | null;
};

export interface GetAdminMenuListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminMenuItem[];
}

export async function getAdminMenuList() {
  try {
    const response = await axios.get<GetAdminMenuListResponse>(API_ENDPOINTS.ADMIN_MENU.BASE);
    return response.data;
  } catch (err) {
    throw err;
  }
}
