import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

export interface LoanApplicant {
  _id: string;
  customerId: string;
  loanApplicationDateTime: string;
  applicantName: string;
  mobileNo: string;
  latestLoanNo: string;
  loanStatus: number;
  loanSubStatus: number;
  totalAppCount: string;
}

export interface LoanApplicantsListResponse {
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
  data: {
    loanApplicants: LoanApplicant[];
  };
}

export interface GetLoanApplicantsListParams {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getLoanApplicantsList(params?: GetLoanApplicantsListParams) {
  try {
    const response = await axios.get<LoanApplicantsListResponse>(API_ENDPOINTS.LOAN_APPLICANTS.BASE, { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function blockLoanApplicant(customerId: string) {
  try {
    const response = await axios.get(API_ENDPOINTS.LOAN_APPLICANTS.BLOCK(customerId));
    return response.data;
  } catch (err) {
    throw err;
  }
}
