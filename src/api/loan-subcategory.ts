import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface LoanSubcategoryItem {
  _id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  code: string;
  status: number; // 0 = inactive, 1 = active
  createdAt: string;
  updatedAt: string;
}

export interface GetLoanSubcategoryListParams {
  page?: number;
  limit?: number;
  category?: string; // category name filter
  code?: string;
  name?: string;
    status?: number; // status filter
  categoryId?: string; // category ID filter
}

export interface GetLoanSubcategoryListResponse {
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
  data: LoanSubcategoryItem[];
}

export interface AddLoanSubcategoryPayload {
  categoryId: string;
  name: string;
  code: string;
  status: number; // 0 = inactive, 1 = active
}

export interface AddLoanSubcategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface UpdateLoanSubcategoryPayload {
  name: string;
  categoryId: string;
  code: string;
  status: number; // 0 = inactive, 1 = active
}

export interface UpdateLoanSubcategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface DeleteLoanSubcategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getLoanSubcategoryList(params?: GetLoanSubcategoryListParams) {
  try {
    const response = await axios.get<GetLoanSubcategoryListResponse>(API_ENDPOINTS.LOAN_SUBCATEGORY.BASE, { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function addLoanSubcategory(payload: AddLoanSubcategoryPayload) {
  try {
    const response = await axios.post<AddLoanSubcategoryResponse>(API_ENDPOINTS.LOAN_SUBCATEGORY.BASE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateLoanSubcategory(id: string, payload: UpdateLoanSubcategoryPayload) {
  try {
    const response = await axios.patch<UpdateLoanSubcategoryResponse>(API_ENDPOINTS.LOAN_SUBCATEGORY.UPDATE(id), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteLoanSubcategory(id: string) {
  try {
    const response = await axios.delete<DeleteLoanSubcategoryResponse>(API_ENDPOINTS.LOAN_SUBCATEGORY.DELETE(id));
    return response.data;
  } catch (err) {
    throw err;
  }
}
