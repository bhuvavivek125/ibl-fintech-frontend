import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const userService = {
  getUsers: async (params: any = {}) => {
    const response = await axios.get(API_ENDPOINTS.USERS.BASE, { params });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await axios.get(API_ENDPOINTS.USERS.DETAIL(id));
    return response.data;
  },

  createUser: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.USERS.BASE, data);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await axios.patch(API_ENDPOINTS.USERS.DETAIL(id), data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await axios.delete(API_ENDPOINTS.USERS.DETAIL(id));
    return response.data;
  },

  activateUser: async (id: string) => {
    const response = await axios.patch(API_ENDPOINTS.USERS.ACTIVATE(id));
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await axios.patch(API_ENDPOINTS.USERS.DEACTIVATE(id));
    return response.data;
  }
};

export default userService;
