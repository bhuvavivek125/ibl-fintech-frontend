export interface BRETemplate {
  _id: string;
  templateId: string;
  templateName: string;
  description: string | null;
  isActive: boolean;
  config: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRule {
  ruleName: string;
  _id: string;
}

export interface BRETemplateListItem {
  _id: string;
  templateId: string;
  templateName: string;
  description: string | null;
  isActive: boolean;
  config: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBRETemplateBody {
  templateName: string;
  description?: string;
}

export interface UpdateBRETemplateBody {
  templateName?: string;
  description?: string;
  isActive?: boolean;
}

export interface BRETemplateListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    templates: BRETemplateListItem[];
    count: number;
  };
}

export interface BRETemplateDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BRETemplate;
}

export interface BRETemplateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: BRETemplate;
}

export interface CreateBRETemplateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    templateId: string;
  };
}

export interface GetBRETemplateListParams {
  isActive?: boolean;
  searchText?: string;
  page?: number;
  limit?: number;
}

export interface DialogFormState {
  templateName: string;
  description: string;
}

// BRE Template Rules (Add Rule to Template)
export interface RuleOverrideValue {
  operator: string;
  current: number | boolean | null;
  min: number | null;
  max: number | null;
  variables?: Record<string, number | boolean | string | null>;
}

export interface AddRuleToTemplateBody {
  ruleId: string;
  overrideValue: RuleOverrideValue;
  sortOrder?: number;
}

export interface TemplateRuleItem {
  _id: string;
  templateId: string;
  ruleId: string;
  ruleName: string;
  ruleCode: string;
  description: string;
  sourceValue: RuleOverrideValue; // Original rule value
  overrideValue: RuleOverrideValue; // Template-specific override value
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRule {
  _id: string;
  templateId: string;
  overrideValue: RuleOverrideValue;
  isActive: boolean;
  ruleId?: string;
  rule?: {
    _id: string;
    ruleName: string;
    ruleCode: string;
    description: string;
    isActive: boolean;
    config?: any;
  };
}

export interface GetTemplateRulesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    rules: TemplateRule[];
    count: number;
    templateName: string;
    templateId: string;
  };
}

export interface UpdateRuleInTemplateBody {
  overrideValue?: RuleOverrideValue | null;
  isActive?: boolean;
}

export interface UpdateRuleInTemplateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: TemplateRule;
}

export interface AddRuleToTemplateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: TemplateRuleItem;
}

export interface RemoveRuleFromTemplateResponse {
  success: boolean;
  statusCode: number;
  message: string;
}
