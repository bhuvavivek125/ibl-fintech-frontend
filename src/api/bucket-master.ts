import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface BucketItem {
  _id: string;
  bucketName: string;
  fromDays: number;
  toDays: number;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetBucketListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    buckets: BucketItem[];
  };
}

export interface AddBucketPayload {
  bucketName: string;
  fromDays: number;
  toDays: number;
  remark?: string;
}

export interface GenericResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getBucketMasterList() {
  try {
    const response = await axios.get<GetBucketListResponse>(API_ENDPOINTS.BUCKET_MASTER.LIST);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function addBucketMaster(payload: AddBucketPayload) {
  try {
    const response = await axios.post<GenericResponse>(API_ENDPOINTS.BUCKET_MASTER.CREATE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateBucketMaster(id: string, payload: AddBucketPayload) {
  try {
    const response = await axios.patch<GenericResponse>(API_ENDPOINTS.BUCKET_MASTER.UPDATE(id), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteBucketMaster(id: string) {
  try {
    const response = await axios.delete<GenericResponse>(API_ENDPOINTS.BUCKET_MASTER.DELETE(id));
    return response.data;
  } catch (err) {
    throw err;
  }
}
