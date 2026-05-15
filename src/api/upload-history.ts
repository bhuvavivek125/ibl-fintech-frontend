import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface UploadHistoryItem {
  _id: string;
  fileName: string;
  fileSize: number;
  status: number;
  statusLabel: string;
  stats: {
    total: number;
    success: number;
    errors: number;
  };
  errorDetails?: Array<{
    rowNumber: number;
    errorMessage: string;
    data: any;
    _id?: string;
  }>;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadHistoryResponse {
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
  data: UploadHistoryItem[];
}

export interface ErrorDetail {
  rowNumber: number;
  errorMessage: string;
  data: any;
}

export interface UploadHistoryDetailResponse {
  success: boolean;
  data: {
    _id: string;
    fileName: string;
    fileSize: number;
    status: number;
    statusLabel: string;
    stats: {
      total: number;
      success: number;
      errors: number;
    };
    errorDetails: ErrorDetail[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface UploadHistoryItem {
  _id: string;
  fileName: string;
  fileSize: number;
  status: number;
  statusLabel: string;
  stats: {
    total: number;
    success: number;
    errors: number;
  };
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetUploadHistoryParams {
  page?: number;
  limit?: number;
}

export interface ErrorDetail {
  rowNumber: number;
  errorMessage: string;
  data: any;
  _id?: string;
}

export interface SelectedUpload {
  _id: string;
  fileName: string;
  fileSize: number;
  status: number;
  statusLabel: string;
  stats: {
    total: number;
    success: number;
    errors: number;
  };
  errorDetails: ErrorDetail[];
  createdAt: string;
  updatedAt: string;
}

export async function getUploadHistory(params: GetUploadHistoryParams) {
  const response = await axios.get(API_ENDPOINTS.UPLOAD_HISTORY.LIST, { params });
  return response.data;
}
