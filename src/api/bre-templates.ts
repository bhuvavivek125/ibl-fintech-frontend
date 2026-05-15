import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';
import {
  BRETemplateListResponse,
  BRETemplateResponse,
  CreateBRETemplateBody,
  GetBRETemplateListParams,
  UpdateBRETemplateBody,
  AddRuleToTemplateBody,
  GetTemplateRulesResponse,
  AddRuleToTemplateResponse,
  CreateBRETemplateResponse,
  UpdateRuleInTemplateBody,
  UpdateRuleInTemplateResponse
} from 'types/bre-template';

export const getBRETemplateList = async (params?: GetBRETemplateListParams): Promise<BRETemplateListResponse> => {
  try {
    const queryParams: any = {};
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
    if (params?.searchText) queryParams.searchText = params.searchText;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const response = await axios.get<BRETemplateListResponse>(API_ENDPOINTS.BRE_TEMPLATES.LIST, { params: queryParams });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const createBRETemplate = async (payload: CreateBRETemplateBody): Promise<CreateBRETemplateResponse> => {
  try {
    const response = await axios.post<CreateBRETemplateResponse>(API_ENDPOINTS.BRE_TEMPLATES.CREATE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const updateBRETemplate = async (templateId: string, payload: UpdateBRETemplateBody): Promise<BRETemplateResponse> => {
  try {
    const response = await axios.patch<BRETemplateResponse>(API_ENDPOINTS.BRE_TEMPLATES.UPDATE(templateId), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const addRuleToTemplate = async (templateId: string, payload: AddRuleToTemplateBody): Promise<AddRuleToTemplateResponse> => {
  try {
    const response = await axios.post<AddRuleToTemplateResponse>(API_ENDPOINTS.BRE_TEMPLATES.ADD_RULE(templateId), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const updateRuleInTemplate = async (
  templateId: string,
  ruleId: string,
  payload: UpdateRuleInTemplateBody
): Promise<UpdateRuleInTemplateResponse> => {
  try {
    const response = await axios.patch<UpdateRuleInTemplateResponse>(API_ENDPOINTS.BRE_TEMPLATES.UPDATE_RULE(templateId, ruleId), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getTemplateRules = async (templateId: string): Promise<GetTemplateRulesResponse> => {
  try {
    const response = await axios.get<GetTemplateRulesResponse>(API_ENDPOINTS.BRE_TEMPLATES.GET_TEMPLATE_RULES(templateId));
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const duplicateBRETemplate = async (templateId: string): Promise<BRETemplateResponse> => {
  try {
    const response = await axios.post<BRETemplateResponse>(API_ENDPOINTS.BRE_TEMPLATES.DUPLICATE_BRE_TEMPLATE(templateId));
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteBRETemplate = async (templateId: string): Promise<BRETemplateResponse> => {
  try {
    const response = await axios.delete<BRETemplateResponse>(API_ENDPOINTS.BRE_TEMPLATES.DELETE(templateId));
    return response.data;
  } catch (err) {
    throw err;
  }
};