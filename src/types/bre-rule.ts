export enum BRE_MODULE_TYPE {
  USER_DEVICE_AND_DATA = 1,
  LOAN_EXPOSURE = 2,
  REPEAT_LOAN_CUSTOMER = 3,
  LOAN_CONFIGURATION = 4,
  BUREAU_RULES = 5
}

export enum OPERATOR {
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  EQ = 'eq',
  NEQ = 'neq',
  BETWEEN = 'be tween'
}

export interface RuleValue {
  operator: OPERATOR | string;
  current: number | boolean | null;
  min: number | null;
  max: number | null;
  variables?: Record<string, number | boolean | string | null>; // Support for multiple variables
}

export interface BreRuleItem {
  _id: string;
  ruleCode: string;
  ruleName: string;
  description: string;
  isActive: boolean;
  module: BRE_MODULE_TYPE;
  value: RuleValue;
  config: any;
  createdAt: string;
  updatedAt: string;
}

export interface GetBreRuleListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BreRuleItem[];
}

export interface UpdateBreRulePayload {
  isActive?: boolean;
  value?: RuleValue;
}

export interface GenericResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export interface LoanExposureCyclePayload {
  default_incremental_amount: number;
  partial_increment_amount: number;
}

export interface DpdBracket {
  dpd_min: number;
  dpd_max: number | null;
  decision: string;
}

export interface PenaltyBracket {
  from_loan_amount: number;
  to_loan_amount: number;
  charges_in_rs: number;
}

export interface EMIMissedPenaltyConfig {
  penalty_brackets: PenaltyBracket[];
}

export type BRERule = BreRuleItem;

export interface LoanExposureCycle {
  cycle_number: number;
  default_incremental_amount: number;
  partial_increment_amount: number;
}

export interface LoanExposureBREConfig {
  max_total_exposure: number;
  cycles: LoanExposureCycle[];
}

export interface DpdBracket {
  dpd_min: number;
  dpd_max: number | null;
  decision: string;
}

export interface ActiveRuleByModule {
  ruleName: string;
  _id: string;
}

export interface BreRuleByModuleGroup {
  moduleName: string;
  rules: ActiveRuleByModule[];
}

export interface GetBreRuleActiveByModuleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BreRuleByModuleGroup[];
}
