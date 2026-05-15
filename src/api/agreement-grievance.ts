import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface AgreementGrievanceItem {
  _id: string;
  grievanceOfficerName: string;
  address: string;
  contactNo: string;
  designation: string;
  emailId: string;
  updatedAt: string;
}

export interface GetAgreementGrievanceListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AgreementGrievanceItem[];
}

export interface UpdateAgreementGrievancePayload {
  grievanceOfficerName: string;
  designation: string;
  address: string;
  contactNo: string;
  emailId: string;
}

export interface UpdateAgreementGrievanceResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface GrievanceForm {
  grievanceOfficerName: string;
  designation: string;
  address: string;
  contactNo: string;
  emailId: string;
}

export async function getAgreementGrievanceListService() {
  try {
    const response = await axios.get<GetAgreementGrievanceListResponse>(API_ENDPOINTS.AGREEMENT_GRIEVANCE.LIST);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateAgreementGrievanceService(id: string, payload: UpdateAgreementGrievancePayload) {
  try {
    const response = await axios.patch<UpdateAgreementGrievanceResponse>(API_ENDPOINTS.AGREEMENT_GRIEVANCE.UPDATE(id), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}
