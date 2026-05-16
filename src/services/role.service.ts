import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const roleService = {
  getRoles: async () => {
    const response = await axios.get(API_ENDPOINTS.ROLES.BASE);
    return response.data;
  },

  createRole: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.ROLES.BASE, data);
    return response.data;
  },

  updateRole: async (id: string, data: any) => {
    const response = await axios.patch(API_ENDPOINTS.ROLES.DETAIL(id), data);
    return response.data;
  },

  getUserMenu: async () => {
    const response = await axios.get(API_ENDPOINTS.ROLES.MENU);
    return response.data;
  },

  getPermissions: async () => {
    const response = await axios.get(API_ENDPOINTS.PERMISSIONS.BASE);
    return response.data;
  },

  createPermission: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.PERMISSIONS.BASE, data);
    return response.data;
  }
};

export default roleService;
