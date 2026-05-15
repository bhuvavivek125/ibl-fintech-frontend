import { BRE_MODULE_TYPE, OPERATOR } from 'types/bre-rule';

export const BRE_REPEAT_LOAN_DECISION: Record<string, string> = {
  FULL_INCREMENT: 'full_increment',
  PARTIAL_INCREMENT: 'partial_increment',
  STABLE: 'stable',
  NOT_ELIGIBLE_FOR_REPEAT_LOAN: 'not_eligible_for_repeat_loan'
};

export const DECISION_LABEL: Record<string, string> = {
  full_increment: 'Full Increment',
  partial_increment: 'Partial Increment',
  stable: 'Stable',
  not_eligible_for_repeat_loan: 'Not Eligible for Repeat Loan'
};

export const DECISION_COLOR: Record<string, { bg: string; color: string; border: string }> = {
  full_increment: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  partial_increment: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
  stable: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  not_eligible_for_repeat_loan: { bg: '#FFF1F2', color: '#DC2626', border: '#FECDD3' }
};

export const OPERATOR_LABEL: Record<string, string> = {
  [OPERATOR.GTE]: '≥',
  [OPERATOR.LTE]: '≤',
  [OPERATOR.EQ]: '=',
  [OPERATOR.BETWEEN]: 'Range',
  [OPERATOR.GT]: '>',
  [OPERATOR.LT]: '<'
};

export const TABS = [
  { module: BRE_MODULE_TYPE.USER_DEVICE_AND_DATA, label: 'User Device & Data' },
  { module: BRE_MODULE_TYPE.LOAN_EXPOSURE, label: 'Loan Exposure' },
  { module: BRE_MODULE_TYPE.REPEAT_LOAN_CUSTOMER, label: 'Repeat Loan Customer' },
  { module: BRE_MODULE_TYPE.LOAN_CONFIGURATION, label: 'Loan Configuration' },
  { module: BRE_MODULE_TYPE.BUREAU_RULES, label: 'Credit Bureau Criteria' }
];
