import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

export interface AdminLoanListItem {
  _id: string;
  userType: string;
  applicationId: string;
  appDate: string;
  applicantName: string;
  mobile: string;
  status: string;
  tatType: string;
  tat: number;
  tatDays: number;
  tenure: number;
  tenureType: string;
  approvedAmount: number;
  disbursedAmount: number;
  isDisbursed: boolean;
  completedStage: number;
  manualVerificationStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoanListResponse {
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
  data: AdminLoanListItem[];
}

export interface GetLoanListQuery {
  fromDate?: string;
  toDate?: string;
  productCode?: string;
  userType?: string;
  loanStatus?: string;
  manualVerificationStatus?: string;
  mobile?: string;
  applicationId?: string;
  sortBy?: 'applicationDate' | 'loanAmount' | 'tat' | 'loanStatus';
  sortOrder?: 'asc' | 'desc';
  page?: string | number;
  limit?: string | number;
}

export interface LoanNumber {
  _id: string;
  loanNumber: string;
}

export interface GetLoanNumberListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoanNumber[];
}

export async function getAdminLoanList(params?: GetLoanListQuery) {
  try {
    const response = await axios.get<AdminLoanListResponse>(API_ENDPOINTS.LOAN_APPLICATION.BASE, { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getLoanNumberList() {
  try {
    const response = await axios.get<GetLoanNumberListResponse>(API_ENDPOINTS.LOAN_APPLICATION.LOAN_NUMBER_LIST);
    return response.data;
  } catch (err) {
    throw err;
  }
}
