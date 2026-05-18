import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const settingsService = {
  getSettings: async () => {
    const response = await axios.get(API_ENDPOINTS.SETTINGS.BASE);
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await axios.patch(API_ENDPOINTS.SETTINGS.BASE, data);
    return response.data;
  }
};

export default settingsService;
