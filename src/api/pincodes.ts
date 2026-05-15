import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface AddPincodePayload {
  stateId?: string;
  state?: string;
  city: string;
  pincode: string;
  status?: boolean;
}

export async function addServiceablePincode(payload: AddPincodePayload) {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICEABLE_PINCODE.BASE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function uploadPincodes(formData: FormData) {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICEABLE_PINCODE.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function uploadPincodesExcel(formData: FormData) {
  try {
    const response = await axios.post(API_ENDPOINTS.SERVICEABLE_PINCODE.UPLOAD_EXCEL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export interface GetPincodeListParams {
  city?: string;
  state?: string;
  pincode?: string;
  page?: number;
  limit?: number;
  isActive?: number | boolean;
}

export interface PincodeItem {
  _id: string;
  pincode: string;
  city: string;
  isActive: boolean;
  stateId: string;
  state: string;
  createdAt: string;
}

export interface GetPincodeListResponse {
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
  data: PincodeItem[];
}

export async function getServiceableAreaPincodes(params: GetPincodeListParams) {
  try {
    const response = await axios.get<GetPincodeListResponse>(
      API_ENDPOINTS.SERVICEABLE_PINCODE.BASE,
      { params }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updatePincodeStatus(id: string, isActive: boolean) {
  try {
    const response = await axios.patch(
      API_ENDPOINTS.SERVICEABLE_PINCODE.STATUS(id),
      { isActive }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export interface BulkUpdatePincodeStatusPayload {
  isActive: boolean;
  pincodeIds: string[];
}

export interface BulkUpdatePincodeStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function bulkUpdatePincodeStatus(payload: BulkUpdatePincodeStatusPayload) {
  try {
    const response = await axios.patch<BulkUpdatePincodeStatusResponse>(
      API_ENDPOINTS.SERVICEABLE_PINCODE.BULK_STATUS,
      payload
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export interface StateItem {
  _id: string;
  state: string;
  cityList: string[];
}

export interface GetStateListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: StateItem[];
}

export async function getStateList() {
  try {
    const response = await axios.get<GetStateListResponse>(API_ENDPOINTS.STATE.LIST);
    return response.data;
  } catch (err) {
    throw err;
  }
}