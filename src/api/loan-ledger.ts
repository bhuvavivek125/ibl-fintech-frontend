import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';
export interface LoanLedgerItem {
  vouNo: string;
  date: string;
  particular: string;
  debit: number;
  credit: number;
  balance: number;
  balanceType: string;
  des: string;
  tranMode: string;
  refNo: string;
  interest: number;
  principal: number;
  overdueInterest: number;
  penal: number;
  loanNumber: string;
}
export interface LoanNoItem {
  loanNo: string;
}
export interface LoanLedgerData {
  loanLedgerList: LoanLedgerItem[];
  loanNoList: LoanNoItem[];
  customerName: string;
}
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface LoanLedgerListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: PaginationMeta;
  data: LoanLedgerData;
}
export interface GetLoanLedgerListParams {
  page?: number;
  limit?: number;
  mobileNo?: string;
  panNo?: string;
  loanNo?: string;
  emailId?: string;
}

export async function getLoanLedgerList(params?: GetLoanLedgerListParams) {
  try {
    const response = await axios.get<LoanLedgerListResponse>(API_ENDPOINTS.LOAN_LEDGER.LIST, { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}
