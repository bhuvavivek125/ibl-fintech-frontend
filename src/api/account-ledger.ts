import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

export interface AccountName {
  _id: string;
  accountName: string;
}

export interface AccountLedgerEntry {
  _id: string;
  loanNumber: string;
  date: string;
  particular: string;
  customerName: string;
  debit?: number | string;
  credit?: number | string;
  voucherNo?: string;
  narration?: string;
  tranMode?: string;
  refNo?: string;
  gstin?: string;
  balance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountLedgerListResponse {
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
  data: AccountLedgerEntry[];
}

export interface GetAccountNameListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AccountName[];
}

export interface GetAccountLedgerListParams {
  page?: number;
  limit?: number;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  loanNumber?: string;
}

export async function getAccountNameList() {
  try {
    const response = await axios.get<GetAccountNameListResponse>(
      `${API_ENDPOINTS.ACCOUNT_LEDGER.LIST}/account-names`
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAccountLedgerList(params?: GetAccountLedgerListParams) {
  try {
    const response = await axios.get<AccountLedgerListResponse>(API_ENDPOINTS.ACCOUNT_LEDGER.LIST, { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}
