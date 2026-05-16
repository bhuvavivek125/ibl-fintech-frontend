import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const dashboardService = {
  getOverview: async () => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
    return response.data;
  },

  getActivities: async (limit: number = 10) => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.ACTIVITIES, { params: { limit } });
    return response.data;
  },

  getCharts: async () => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.CHARTS);
    return response.data;
  },

  getUserGrowth: async (months: number = 6) => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.USER_GROWTH, { params: { months } });
    return response.data;
  }
};

export default dashboardService;
