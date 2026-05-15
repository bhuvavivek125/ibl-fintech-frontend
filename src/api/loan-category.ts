import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface LoanCategoryItem {
  _id: string;
  name: string;
  accountType: string;
  purpose: string;
  updatedAt: string;
}

export interface GetLoanCategoryListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoanCategoryItem[];
}

export interface UpdateLoanCategoryPayload {
  name: string;
  accountType: string;
  purpose: string;
}

export interface UpdateLoanCategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoanCategoryItem;
}

export async function getLoanCategoryList() {
  try {
    const response = await axios.get<GetLoanCategoryListResponse>(
      API_ENDPOINTS.LOAN_CATEGORY.LIST
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateLoanCategory(id: string, payload: UpdateLoanCategoryPayload) {
  try {
    const response = await axios.patch<UpdateLoanCategoryResponse>(
      API_ENDPOINTS.LOAN_CATEGORY.UPDATE(id),
      payload
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}