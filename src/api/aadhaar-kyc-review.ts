import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

// Aadhaar KYC Details Interfaces
export interface AadhaarVerificationDetails {
  fullNameRaw: string;
  aadhaarKycId: string;
  dateOfBirth: string;
  gender: string;
  aadhaarNumber: string;
  fullAddress: string;
  state: string;
  pincode: string;
  nameMatchScore?: number;
  verificationStatus: 'VERIFIED' | 'FAILED';
  responseTimestamp: string;
  providerResponse?: any;
}

export interface PanVerificationDetails {
  panNumber: string;
  panName: string;
  dobMatch: 'MATCH' | 'NOT_MATCH';
  panStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  nameMatchScore: number;
}

export interface CustomerInfo {
  primaryMobileNumber: string;
  whatsAppNumber: string;
  email: string;
  loanAmount: number;
}

export interface ResidentAddress {
  houseflatNo: string;
  streetAddress: string;
  state: string;
  city: string;
  pincode: string;
}

export interface ReferenceInformation {
  relation: number;
  relationOther: string | null;
  fullName: string;
  mobileNumber: string;
  relationName: string;
}

export interface LoanAdditionalDetails {
  _id: string;
  loan: string;
  gender: number;
  maritalStatus: number;
  residentAddress: ResidentAddress;
  educationLevel: number;
  otherEducation?: string;
  loanPurposeOther?: string;
  householdIncomeDeclaration: boolean;
  alternateMobileNo: string;
  isVerifiedAlternateMobileNo: boolean;
  isVerifiedWhatsappMobileNo: boolean;
  referenceInformation: ReferenceInformation[];
  createdAt: string;
  updatedAt: string;
  employmentType: number;
  loanPurpose: number;
  monthlyIncome: number;
  whatsAppMobileNo: string;
  genderName: string;
  maritalStatusName: string;
  educationLevelName: string;
  employmentTypeName: string;
  loanPurposeName: string;
}

export interface AddressUserEntered {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PrimaryContactDetails {
  registeredMobileNumber: string;
  whatsAppNumber: string;
  alternateMobileNumber: string;
  emailId: string;
}

export interface ContactInformation {
  primaryContactDetails: PrimaryContactDetails;
}

export interface AadhaarVerificationFiles {
  aadhaarCardPdf: string;
  applicantPhoto: string;
  aadhaarCardPdfUrl: string;
  applicantPhotoUrl: string;
}

export interface ApplicantDetailsData {
  _id: string;
  aadhaarVerificationDetails: AadhaarVerificationDetails;
  panVerificationDetails: PanVerificationDetails;
  customer: CustomerInfo;
  loanAdditionalDetails: LoanAdditionalDetails[];
  addressUserEntered: AddressUserEntered;
  contactInformation: ContactInformation;
  aadhaarVerificationFiles: AadhaarVerificationFiles;
  loanSanctionDetails: {
    commercialSnapshot: {
      loanAmount: number;
      tenure: number;
      tenureType: string;
  }
}
  applicantName: string;
}

export interface ApplicantDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ApplicantDetailsData;
}

export interface UpdateAadhaarNameCorrectionRequest {
  aadhaarName: string;
}

export interface UpdateAadhaarNameCorrectionResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export async function getApplicantDetails(applicantId: string) {
  try {
    const response = await axios.get<ApplicantDetailsResponse>(
     API_ENDPOINTS.MANUAL_REVIEW.APPLICANT_DETAIL(applicantId)
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateAadhaarNameCorrection(
  applicantId: string,
  aadhaarName: string
) {
  try {
    const response = await axios.put<UpdateAadhaarNameCorrectionResponse>(
     API_ENDPOINTS.MANUAL_REVIEW.UPDATE_AADHAAR_NAME(applicantId),
      { aadhaarName }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}
