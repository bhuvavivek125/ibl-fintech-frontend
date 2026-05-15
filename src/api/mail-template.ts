import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

export interface IMailTemplate {
  _id: string;
  templateCode: string;
  templateName: string;
  subject: string;
  bodyHtml: string;
  variables: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMailTemplateListItem {
  bodyHtml: string | undefined;
  _id: string;
  templateCode: string;
  templateName: string;
  subject: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  variables: number | string[];
}

export interface CreateMailTemplateBody {
  templateCode: string;
  templateName: string;
  subject: string;
  bodyHtml: string;
  variables: string[];
  isActive?: boolean;
}

export interface UpdateMailTemplateBody {
  templateName?: string;
  subject?: string;
  bodyHtml?: string;
  variables?: string[];
  isActive?: boolean;
}

export interface MailTemplateListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  data: IMailTemplateListItem[];
}

export interface MailTemplateDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IMailTemplate;
}

export interface MailTemplateResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface SendTestEmailBody {
  templateCode: string;
  email: string;
  variables?: Record<string, string>;
}

export interface SendTestEmailResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

// Get mail template list
export const getMailTemplateList = async (
  searchText?: string,
  isActive?: boolean,
  page: number = 1,
  limit: number = 25
): Promise<MailTemplateListResponse> => {
  const params: any = { page, limit };
  if (searchText) params.searchText = searchText;
  if (isActive !== undefined) params.isActive = isActive;

  const response = await axios.get<MailTemplateListResponse>(API_ENDPOINTS.MAIL_TEMPLATES?.LIST, { params });
  return response.data;
};

export const getMailTemplateById = async (templateId: string): Promise<MailTemplateDetailResponse> => {
  const response = await axios.get<MailTemplateDetailResponse>(API_ENDPOINTS.MAIL_TEMPLATES?.DETAIL(templateId));
  return response.data;
};

export const createMailTemplate = async (payload: CreateMailTemplateBody): Promise<MailTemplateResponse> => {
  const response = await axios.post<MailTemplateResponse>(API_ENDPOINTS.MAIL_TEMPLATES.CREATE, payload);
  return response.data;
};

export const updateMailTemplate = async (templateId: string, payload: UpdateMailTemplateBody): Promise<MailTemplateResponse> => {
  const response = await axios.put<MailTemplateResponse>(API_ENDPOINTS.MAIL_TEMPLATES?.UPDATE(templateId), payload);
  return response.data;
};

export const sendTestEmail = async (payload: SendTestEmailBody): Promise<SendTestEmailResponse> => {
  const response = await axios.post<SendTestEmailResponse>(API_ENDPOINTS.MAIL_TEMPLATES.SEND_MAIL, payload);
  return response.data;
};

export const getPredefinedVariables = (): string[] => {
  return [
    'customer_name',
    'loan_id',
    'loan_no',
    'loan_amount',
    'payment_amount',
    'payment_date',
    'agent_name',
    'agent_phone',
    'receipt_number',
    'company_name',
    'cta_link',
    'interest_rate',
    'approved_amount',
    'tenure',
    'due_date',
    'emi_amount',
    'days_overdue',
    'due_amount',
    'closure_date'
  ];
};
