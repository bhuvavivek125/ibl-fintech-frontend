import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface LanguageItem {
  _id: string;
  name: string;
  nativeName: string;
  languageIcon: string;
  code: string;
  status: number; // 0 = inactive, 1 = active
  updatedAt: string;
}

export interface GetLanguageListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LanguageItem[];
}

export interface AddLanguagePayload {
  name: string;
  nativeName: string;
  languageIcon: string;
  code: string;
  status: number; // 0 = inactive, 1 = active
}

export interface AddLanguageResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface UpdateLanguagePayload {
  name: string;
  nativeName: string;
  languageIcon: string;
  code: string;
  status: number; // 0 = inactive, 1 = active
}

export interface UpdateLanguageResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface DeleteLanguageResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getLanguageList() {
  try {
    const response = await axios.get<GetLanguageListResponse>(API_ENDPOINTS.LANGUAGE.BASE);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function addLanguage(payload: AddLanguagePayload) {
  try {
    const response = await axios.post<AddLanguageResponse>(API_ENDPOINTS.LANGUAGE.BASE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateLanguage(id: string, payload: UpdateLanguagePayload) {
  try {
    const response = await axios.patch<UpdateLanguageResponse>(API_ENDPOINTS.LANGUAGE.UPDATE(id), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteLanguage(id: string) {
  try {
    const response = await axios.delete<DeleteLanguageResponse>(API_ENDPOINTS.LANGUAGE.DELETE(id));
    return response.data;
  } catch (err) {
    throw err;
  }
}
