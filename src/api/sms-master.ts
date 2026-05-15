import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface SMSMasterItem {
  _id: string;
  smsType: number;
  smsTypeName: string;
  template: string;
  dltTemplateId: string;
  senderId: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetSMSMasterListParams {
  page?: number;
  limit?: number;
  searchText?: string;
  isActive?: boolean;
}

export interface GetSMSMasterListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  data: SMSMasterItem[];
}

export interface CreateSMSMasterPayload {
  smsType: number;
  smsTypeName: string;
  template?: string;
  dltTemplateId?: string;
  senderId?: string;
  variables?: string[];
  isActive?: boolean;
}

export interface CreateSMSMasterResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface UpdateSMSMasterPayload {
  smsTypeName?: string;
  template?: string;
  dltTemplateId?: string;
  senderId?: string;
  variables?: string[];
  isActive?: boolean;
}

export interface UpdateSMSMasterResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getSMSMasterList(params: GetSMSMasterListParams) {
  try {
    const response = await axios.get<GetSMSMasterListResponse>(API_ENDPOINTS.SMS_MASTER.BASE, { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function createSMSMaster(payload: CreateSMSMasterPayload) {
  try {
    const response = await axios.post<CreateSMSMasterResponse>(API_ENDPOINTS.SMS_MASTER.BASE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateSMSMaster(id: string, payload: UpdateSMSMasterPayload) {
  try {
    const response = await axios.put<UpdateSMSMasterResponse>(API_ENDPOINTS.SMS_MASTER.BY_ID(id), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}
