import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const authService = {
  register: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  login: async (data: any) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, data);
    if (response.data.success) {
      localStorage.setItem('serviceToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminUser');
    return response.data;
  },

  getMe: async () => {
    const response = await axios.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }
};

export default authService;
