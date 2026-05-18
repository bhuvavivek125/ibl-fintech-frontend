import axios, { AxiosRequestConfig } from 'axios';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    // Check for admin token first, then service token
    const adminToken = localStorage.getItem('adminAccessToken');
    const accessToken = localStorage.getItem('serviceToken');
    const token = adminToken || accessToken;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const loginPath = '/login';

      if (!window.location.href.includes(loginPath)) {
        // Clear tokens
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('serviceToken');
        window.location.pathname = loginPath;
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export async function fetcher(args: string | [string, AxiosRequestConfig]) {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
}
