import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

// Enums
export enum MANUAL_REVIEW_TYPE {
  AADHAAR_EKYC = 'aadhaar_ekyc',
  BANK_VERIFICATION = 'bank_verification'
}

// Query/Filter Interfaces
export interface GetManualReviewListQuery {
  page?: string | number;
  limit?: string | number;
  loanNo?: string;
  mobileNumber?: string;
  reviewType?: MANUAL_REVIEW_TYPE;
  sortOrder?: 'asc' | 'desc';
}

// Response Data Interfaces
export interface ManualReviewItem {
  customerId: string;
  loanApplicationNo: string;
  customerName: string;
  mobileNumber: string;
  verificationType: string;
  matchScore: string;
  status: string;
  createdAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ManualReviewListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: PaginationInfo;
  data: ManualReviewItem[];
}

// API Functions
export async function getManualReviewList(params?: GetManualReviewListQuery) {
  try {
    const response = await axios.get<ManualReviewListResponse>(
      API_ENDPOINTS.MANUAL_REVIEW.QUEUE_LIST,
      { params }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}
