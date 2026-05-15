import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

export enum DISBURSEMENT_STATUS {
  PENDING = 1,
  INITIATED = 2,
  IN_PROCESS = 3,
  COMPLETED = 4,
  FAILED = 5,
  TANKED = 6
}

export enum ADMIN_DISBURSEMENT_STATUS {
  PENDING = 'PENDING',
  FRESH = 'FRESH',
  FAILED = 'FAILED',
  REQUESTED = 'REQUESTED',
  COMPLETED = 'COMPLETED'
}

export enum DISBURSEMENT_STATUS_NAME {
  PENDING = 'Pending',
  INITIATED = 'Initiated',
  IN_PROCESS = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export enum DISBURSEMENT_UTR {
  IMPS = 1,
  NEFT = 2,
  RTGS = 3,
  ANY = 4,
  A2A = 5
}

export interface Disbursement {
  _id: string;
  amount: number;
  createdAt: Date;
  isManualDisbursement: boolean;
  isVerified: boolean;
  provider: number;
  providerName: string;
  providerRequestId: string;
  retryCount: number;
  status: DISBURSEMENT_STATUS;
  utr: DISBURSEMENT_UTR;
  lastRetryAt: Date;
  verifiedAt: Date;
  failureReason: string;
  customer: {
    _id: string;
    referenceNumber: string;
    primaryMobile: string;
    fullNamePerPan: string;
  }
  loan: {
    _id: string;
    loanNumber: string;
  }
  history: {
    _id: string;
    status: DISBURSEMENT_STATUS;
    failureReason: string;
    createdAt: Date;
  }[]
}

export interface DisbursementStats {
  pendingFresh: number;
  failed: number;
  payoutRequested: number;
  completedToday: number;
  todayDisbursed: number;
}

export interface DisbursementSummary {
  pendingCount: number;
  failedCount: number;
  requestedCount: number;
  completedTodayCount: number;
  todayDisbursedAmount: string;
}

export interface DisbursementListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Disbursement[];
}

export interface GetDisbursementListParams {
  page?: number;
  limit?: number;
  applicantName?: string;
  loanNumber?: string;
  status?: ADMIN_DISBURSEMENT_STATUS;
  payoutChannel?: string;
  startDate?: string;
  endDate?: string;
}

export async function getDisbursementList(params?: GetDisbursementListParams) {
  try {
    const queryParams: any = {};

    if (params?.status) queryParams.status = params.status;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.applicantName) queryParams.applicantName = params.applicantName;
    if (params?.loanNumber) queryParams.loanNumber = params.loanNumber;
    if (params?.payoutChannel) queryParams.payoutChannel = params.payoutChannel;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;

    const response = await axios.get<DisbursementListResponse>(API_ENDPOINTS.DISBURSEMENT.BASE, {
      params: queryParams
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getEligibleProviders(amount: number) {
  try {
    const response = await axios.get(API_ENDPOINTS.DISBURSEMENT.GET_ELIGIBLE_PROVIDERS, {
      params: { amount }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function manualDisbursement(disbursementProcessingIds: string[], payoutName: string) {
  try {
    const response = await axios.post(API_ENDPOINTS.DISBURSEMENT.MANUAL_DISBURSEMENT, { disbursementProcessingIds, payoutName });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getDisbursementSummary() {
  try {
    const response = await axios.get(API_ENDPOINTS.DISBURSEMENT.SUMMARY);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function toggleAutoDisbursement(status: 0 | 1) {
  try {
    const response = await axios.post(API_ENDPOINTS.DISBURSEMENT.AUTO_TOGGLE, { status });
    return response.data;
  } catch (err) {
    throw err;
  }
}
