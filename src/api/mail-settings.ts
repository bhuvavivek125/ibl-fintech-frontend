import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface IMailSettings {
  _id: string;
  applicationName: string;
  supportEmail: string;
  logoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MailSettingsSaveResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IMailSettings;
}

export const saveMailSettings = async (payload: FormData): Promise<MailSettingsSaveResponse> => {
  const response = await axios.post<MailSettingsSaveResponse>(API_ENDPOINTS.MAIL_SETTINGS?.SAVE, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
