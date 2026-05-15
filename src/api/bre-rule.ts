import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';
import { GetBreRuleListResponse, GenericResponse, RuleValue, DpdBracket, LoanExposureCyclePayload, PenaltyBracket, GetBreRuleActiveByModuleResponse } from 'types/bre-rule';

export async function getBreRuleList(module?: number) {
  try {
    const response = await axios.get<GetBreRuleListResponse>(API_ENDPOINTS.BRE_RULES.LIST, {
      params: module !== undefined ? { module } : undefined
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getBreRuleActiveByModule() {
  try {
    const response = await axios.get<GetBreRuleActiveByModuleResponse>(API_ENDPOINTS.BRE_RULES.ACTIVE_BY_MODULE);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateBreRuleStatus(id: string, isActive: boolean) {
  try {
    const response = await axios.patch<GenericResponse>(API_ENDPOINTS.BRE_RULES.STATUS(id), { isActive });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateBreRuleValue(id: string, value: RuleValue) {
  try {
    const response = await axios.patch<GenericResponse>(API_ENDPOINTS.BRE_RULES.VARIABLE(id), { value, variables: value.variables });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function createLoanExposureCycle(payload: LoanExposureCyclePayload) {
  try {
    const response = await axios.post<GenericResponse>(API_ENDPOINTS.BRE_RULES.LOAN_EXPOSURE_CYCLE, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateLoanExposureCycle(cycleNumber: number, payload: LoanExposureCyclePayload) {
  try {
    const response = await axios.put<GenericResponse>(API_ENDPOINTS.BRE_RULES.LOAN_EXPOSURE_CYCLE_BY_NUMBER(cycleNumber), payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateRepeatLoanDpdBrackets(brackets: Record<string, Partial<DpdBracket>>) {
  try {
    const response = await axios.patch<GenericResponse>(API_ENDPOINTS.BRE_RULES.REPEAT_LOAN_DPD_BRACKETS, {
      brackets
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateEmiMissedPenaltyBrackets(brackets: Record<string, Partial<PenaltyBracket>>) {
  try {
    const response = await axios.patch<GenericResponse>(API_ENDPOINTS.BRE_RULES.EMI_MISSED_PENALTY_BRACKETS, {
      brackets
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteLoanExposureCycle() {
  try {
    const response = await axios.delete<GenericResponse>(API_ENDPOINTS.BRE_RULES.DELETE_LOAN_EXPOSURE_CYCLE);
    return response.data;
  } catch (err) {
    throw err;
  }
}
