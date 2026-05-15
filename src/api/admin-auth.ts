import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      mobileNumber: string;
      designationId: string;
    };
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  designationId: string;
}

export interface AdminLogoutResponse {
}

// Admin Login API
export const adminLogin = async (payload: AdminLoginPayload): Promise<AdminLoginResponse> => {
  try {
    return {} as any;
  } catch (error) {
    throw error;
  }
};

// Admin Logout API
export const adminLogout = async (): Promise<AdminLogoutResponse> => {
  try {
    return {} as any;
  } catch (error) {
    throw error;
  }
};
