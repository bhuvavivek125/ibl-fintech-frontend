import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export type PaymentMethodChargeType = 'percentage' | 'fix';
export type PaymentMethodSourcePlatform = 'both' | 'web' | 'mobile';

export interface PaymentMethodItem {
  _id: string;
  index: number;
  name: string;
  pg: string;
  sourcePlatform: PaymentMethodSourcePlatform;
  icon: string;
  chargeType: PaymentMethodChargeType;
  chargeValue: number;
  gstPercentage: number;
  minCharge: number;
  maxCharge: number;
  status: boolean;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodOption {
  method: string;
  pg: string;
  icon: string;
  pg_charges: number;
  total_payable: number;
}

export interface AddPaymentMethodRequest {
  name: string;
  pg: string;
  sourcePlatform: PaymentMethodSourcePlatform;
  icon: string;
  chargeType: PaymentMethodChargeType;
  chargeValue: number;
  gstPercentage: number;
  minCharge: number;
  maxCharge: number;
}

export interface UpdatePaymentMethodRequest {
  name?: string;
  pg?: string;
  index?: number;
  sourcePlatform?: PaymentMethodSourcePlatform;
  icon?: string;
  chargeType?: PaymentMethodChargeType;
  chargeValue?: number;
  gstPercentage?: number;
  minCharge?: number;
  maxCharge?: number;
  status?: boolean;
}

export interface AddPaymentMethodResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface UpdatePaymentMethodResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface DeletePaymentMethodResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface GetPaymentMethodAdminListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaymentMethodItem[];
}

export interface GetPaymentMethodsByLoanAmountResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    loan_amount: number;
    methods: PaymentMethodOption[];
  };
}

export interface UploadPaymentMethodIconResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    url: string;
  };
}

export async function addPaymentMethod(payload: AddPaymentMethodRequest) {
  try {
    const response = await axios.post<AddPaymentMethodResponse>(API_ENDPOINTS.PAYMENT_METHODS.BASE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updatePaymentMethod(id: string, payload: UpdatePaymentMethodRequest) {
  try {
    const response = await axios.patch<UpdatePaymentMethodResponse>(`${API_ENDPOINTS.PAYMENT_METHODS.BASE}/${id}`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    const response = await axios.delete<DeletePaymentMethodResponse>(`${API_ENDPOINTS.PAYMENT_METHODS.BASE}/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getPaymentMethodAdminList() {
  try {
    const response = await axios.get<GetPaymentMethodAdminListResponse>(API_ENDPOINTS.PAYMENT_METHODS.ADMIN_LIST);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getPaymentMethodsByLoanAmount(loanAmount: number) {
  try {
    const response = await axios.get<GetPaymentMethodsByLoanAmountResponse>(API_ENDPOINTS.PAYMENT_METHODS.BASE, {
      params: { loan_amount: loanAmount }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function uploadPaymentMethodIcon(file: File) {
  try {
    const formData = new FormData();
    formData.append('icon', file);

    const response = await axios.post<UploadPaymentMethodIconResponse>(
      API_ENDPOINTS.PAYMENT_METHODS.UPLOAD_ICON,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}
