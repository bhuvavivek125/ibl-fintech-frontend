import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export enum UPDATE_TYPE {
  HARD = 'HARD',
  SOFT = 'SOFT'
}

export enum APP_PLATFORM {
  ANDROID = 'ANDROID',
  IOS = 'IOS'
}

// Assuming that the status can be either ACTIVE or INACTIVE
export enum STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface IAppVersionControl {
  _id: string;
  platform: APP_PLATFORM;
  versionCode: string;
  message: string;
  storeUrl: string;
  updateType: UPDATE_TYPE;
  status: STATUS;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateAppVersionControlBody {
  versionCode?: string;
  message?: string;
  storeUrl?: string;
  updateType?: UPDATE_TYPE;
  status?: STATUS;
}

export interface AppVersionControlResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAppVersionControl[];
}

export interface UpdateAppVersionControlResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export const getAppVersionControlList = async (): Promise<AppVersionControlResponse> => {
  const response = await axios.get(API_ENDPOINTS.APP_VERSION_CONTROL.BASE);
  return response.data;
};

export const updateAppVersionControl = async (
  platform: string,
  data: UpdateAppVersionControlBody
): Promise<UpdateAppVersionControlResponse> => {
  const response = await axios.patch(API_ENDPOINTS.APP_VERSION_CONTROL.UPDATE(platform), data);
  return response.data;
};
