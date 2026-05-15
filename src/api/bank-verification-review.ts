import { API_ENDPOINTS } from 'constants/apiEndpoints';
import axios from 'utils/axios';

// Aadhaar Verification Interfaces

export interface AadhaarDetail {
  id_number: string;
  document_type: string;
  id_proof_type: string;
  gender: string;
  image: string;
  name: string;
  last_refresh_date: string;
  dob: string;
  current_address: string;
  permanent_address: string;
  current_address_details: {
    address: string;
    locality_or_post_office: string;
    district_or_city: string;
    state: string;
    pincode: string;
  };
  permanent_address_details: {
    address: string;
    locality_or_post_office: string;
    district_or_city: string;
    state: string;
    pincode: string;
  };
}

export interface AadhaarAction {
  id: string;
  action_ref: string;
  type: string;
  status: string;
  execution_request_id: string;
  details: {
    aadhaar: AadhaarDetail;
  };
  validation_result: Record<string, any>;
  completed_at: string;
  face_match_obj_type: string;
  face_match_status: string;
  obj_analysis_status: string;
  processing_done: boolean;
  retry_count: number;
  rules_data: {
    approval_rule: any[];
  };
}

export interface AadhaarProviderResponse {
  id: string;
  updated_at: string;
  created_at: string;
  status: string;
  customer_identifier: string;
  actions: AadhaarAction[];
  reference_id: string;
  transaction_id: string;
  customer_name: string;
  expire_in_days: number;
  reminder_registered: boolean;
  workflow_name: string;
  auto_approved: boolean;
  template_id: string;
}

export interface AadhaarVerificationDetails {
  fullNameRaw: string;
  aadhaarKycId: string;
  dateOfBirth: string;
  providerResponse: AadhaarProviderResponse;
  nameMatchScore: number;
  gender: string;
  aadhaarNumber: string;
  fullAddress: string;
  state: string;
  pincode: string;
  verificationStatus: string;
  responseTimestamp: string;
}

// PAN Verification Interfaces

export interface PanVerificationDetails {
  panNumber: string;
  panName: string;
  dobMatch: string;
  panStatus: string;
  nameMatchScore: number;
}

// Customer Interfaces

export interface Customer {
  primaryMobileNumber: string;
  whatsAppNumber: string;
  email: string;
  loanAmount: number;
}

// Address & Contact Interfaces

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
  panImage: string;
  aadhaarCardPdfUrl: string;
  applicantPhotoUrl: string;
}

export interface LoanSanctionDetails {
  commercialSnapshot: {
    loanAmount: number;
    tenure: number;
    tenureType: string;
  };
}

// Loan Applicant Detail Interface

export interface LoanApplicantDetail {
  _id: string;
  referenceNumber: string;
  aadhaarVerificationDetails: AadhaarVerificationDetails;
  panVerificationDetails: PanVerificationDetails;
  customer: Customer;
  loanAdditionalDetails: LoanAdditionalDetails[];
  addressUserEntered: AddressUserEntered;
  contactInformation: ContactInformation;
  aadhaarVerificationFiles: AadhaarVerificationFiles;
  applicantName: string;
  loanSanctionDetails: LoanSanctionDetails;
}

// Bank Verification Interfaces

export interface BankDetailInfo {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  accountType: number;
}

export interface BankProviderResponse {
  id: string;
  verified: boolean;
  verified_at: string;
  beneficiary_name_with_bank: string;
  fuzzy_match_result: boolean;
  fuzzy_match_score: number;
  validation_mode: string;
}

export interface BankVerificationDetail {
  _id: string;
  providerResponse: BankProviderResponse;
  bankDetail: BankDetailInfo;
  createdAt: string;
}

// Complete Response Interface

export interface BankVerificationDetailsData {
  loanApplicantDetail: LoanApplicantDetail;
  bankVerificationDetail: BankVerificationDetail;
}

export interface BankVerificationDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BankVerificationDetailsData;
}

export async function getBankVerificationDetails(applicantId: string) {
  try {
    const response = await axios.get<BankVerificationDetailsResponse>(API_ENDPOINTS.MANUAL_REVIEW.BANK_VERIFICATION_DETAIL(applicantId));
    return response.data;
  } catch (err) {
    throw err;
  }
}
