import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface LoanCategory {
  _id: string;
  name: string;
}

export interface Bucket {
  _id: string;
  bucketName: string;
  fromDays: number;
  toDays: number;
}

export interface ClassificationItem {
  _id: string;
  loanCategoryId: LoanCategory | string;
  dpdFrom: number;
  dpdTo: number;
  bucketId: Bucket | string;
  classification: number;
  provisioning: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetClassificationListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    classifications: ClassificationItem[];
  };
}

export interface AddClassificationPayload {
  loanCategoryId: string;
  dpdFrom: number;
  dpdTo: number;
  bucketId: string;
  classification: number;
  provisioning: number;
}

export interface UpdateClassificationPayload {
  dpdTo?: number;
  classification?: number;
  provisioning?: number;
}

export interface GenericResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getClassificationList(loanCategoryId: string) {
  try {
    const response = await axios.get<GetClassificationListResponse>(
      `${API_ENDPOINTS.ACCOUNT_CLASSIFICATION.LIST}?loanCategoryId=${loanCategoryId}`
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function addClassification(payload: AddClassificationPayload) {
  try {
    const response = await axios.post<GenericResponse>(
      API_ENDPOINTS.ACCOUNT_CLASSIFICATION.CREATE,
      payload
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateClassification(id: string, payload: UpdateClassificationPayload) {
  try {
    const response = await axios.patch<GenericResponse>(
      API_ENDPOINTS.ACCOUNT_CLASSIFICATION.UPDATE(id),
      payload
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteClassification(id: string) {
  try {
    const response = await axios.delete<GenericResponse>(
      API_ENDPOINTS.ACCOUNT_CLASSIFICATION.DELETE(id)
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}
