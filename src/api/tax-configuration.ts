import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

export interface TaxConfiguration {
  _id: string;
  gstin: string;
  state: string;
  hsnSacCode: string;
  sgstPercentage: number;
  cgstPercentage: number;
  igstPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaxConfigurationPayload {
  gstin: string;
  state: string;
  hsnSacCode: string;
  sgstPercentage: number;
  cgstPercentage: number;
  igstPercentage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export const getTaxConfiguration = async (): Promise<ApiResponse<TaxConfiguration>> => {
  const response = await axios.get(API_ENDPOINTS.TAX_CONFIGURATION.BASE);
  return response.data;
};

export const updateTaxConfiguration = async (id: string, payload: TaxConfigurationPayload): Promise<ApiResponse<void>> => {
  const response = await axios.patch(API_ENDPOINTS.TAX_CONFIGURATION.UPDATE(id), payload);
  return response.data;
};
