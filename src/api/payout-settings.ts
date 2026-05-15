import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export enum CHANNEL_TYPE {
  BANK = 0,
  API = 1,
  WALLET = 2,
  MANUAL = 3
}

export enum CHANNEL_STATUS {
  INACTIVE = 0,
  ACTIVE = 1
}

export interface IPayoutChannel {
  _id: string;
  payoutChannelName: string;
  channelType: CHANNEL_TYPE;
  priority: number;
  minimumThresholdBalance: number;
  currentAvailableBalance: number;
  status: CHANNEL_STATUS;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEligibleProvider {
  _id: string;
  payoutChannelName: string;
  minimumThresholdBalance: number;
  currentBalance: number;
  isActive: boolean;
  disburseAmount: number;
}

export interface IPayoutSetting {
  _id: string;
  channels: IPayoutChannel[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePayoutChannelBody {
  payoutChannelName: string;
  channelType: CHANNEL_TYPE;
  priority: number;
  minimumThresholdBalance: number;
  currentAvailableBalance: number;
  status: CHANNEL_STATUS;
  remarks?: string;
}

export interface UpdatePayoutChannelBody {
  channelType?: CHANNEL_TYPE;
  priority?: number;
  minimumThresholdBalance?: number;
  currentAvailableBalance?: number;
  status?: CHANNEL_STATUS;
  remarks?: string;
}

export interface PayoutSettingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IPayoutChannel[];
}

export interface PayoutChannelResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export const getPayoutSettings = async (): Promise<IPayoutChannel[]> => {
  const response = await axios.get<PayoutSettingsResponse>(API_ENDPOINTS.PAYOUT_SETTINGS.BASE);
  // API returns data as a direct array of channels
  return response.data.data || [];
};

export const createPayoutChannel = async (payload: CreatePayoutChannelBody): Promise<PayoutChannelResponse> => {
    const response = await axios.post<PayoutChannelResponse>(API_ENDPOINTS.PAYOUT_SETTINGS.CREATE, payload);
  return response.data;
};

export const updatePayoutChannel = async (
  channelId: string,
  payload: UpdatePayoutChannelBody
): Promise<PayoutChannelResponse> => {
  const response = await axios.patch<PayoutChannelResponse>(
    API_ENDPOINTS.PAYOUT_SETTINGS.UPDATE(channelId),
    payload
  );
  return response.data;
};

// Get channel type label
export const getChannelTypeLabel = (type: CHANNEL_TYPE): string => {
  const labels: Record<CHANNEL_TYPE, string> = {
    [CHANNEL_TYPE.BANK]: 'Bank',
    [CHANNEL_TYPE.API]: 'API',
    [CHANNEL_TYPE.WALLET]: 'Wallet',
    [CHANNEL_TYPE.MANUAL]: 'Manual'
  };
  return labels[type] || 'Unknown';
};

// Get status label
export const getStatusLabel = (status: CHANNEL_STATUS): string => {
  return status === CHANNEL_STATUS.ACTIVE ? 'Active' : 'Inactive';
};
