import { RuleValue, BRERule } from 'types/bre-rule';

export function isNumericRule(v: RuleValue): boolean {
  return v.operator !== 'eq' && typeof v.current === 'number';
}

export function isBooleanRule(v: RuleValue): boolean {
  return v.operator === 'eq' && typeof v.current === 'boolean';
}

export function isBetweenRule(v: RuleValue): boolean {
  return v.operator === 'between';
}

export function toStr(v: unknown): string {
  return v !== null && v !== undefined ? String(v) : '';
}

/** Format a rupee amount — adds ₹ prefix and Indian locale commas for values ≥ 1000 */
export function formatRupee(value: number): string {
  return value >= 1000 ? `₹${value.toLocaleString('en-IN')}` : String(value);
}

/** Extract variable names from description string (e.g., "{current}" or "{grace_period_days}") */
export function extractVariableNames(description: string): string[] {
  const regex = /\{(\w+)\}/g;
  const matches: string[] = [];

  let match;
  while ((match = regex.exec(description)) !== null) {
    matches.push(match[1]);
  }

  return [...new Set(matches)]; // Remove duplicates
}

/** Get variable value from rule (searches in value and config) */
export function getRuleVariableValue(rule: BRERule, varName: string): number | boolean | string | null {
  // Check in value object first
  if (varName === 'current' && rule.value.current !== undefined) {
    return rule.value.current;
  }
  if (varName === 'min' && rule.value.min !== undefined) {
    return rule.value.min;
  }
  if (varName === 'max' && rule.value.max !== undefined) {
    return rule.value.max;
  }

  // Check in value.variables
  if (rule.value.variables && varName in rule.value.variables) {
    return rule.value.variables[varName];
  }

  // Check in config object
  if (rule.config && varName in rule.config) {
    return rule.config[varName];
  }

  return null;
}

/** Build RuleValue patch payload from edited fields */
export function buildRuleValuePayload(original: RuleValue, editCurrent: string, editMin: string, editMax: string): Partial<RuleValue> {
  const newValue: RuleValue = { ...original };

  if (isBetweenRule(original)) {
    newValue.min = editMin !== '' ? Number(editMin) : null;
    newValue.max = editMax !== '' ? Number(editMax) : null;
    return { min: newValue.min, max: newValue.max };
  }

  if (isBooleanRule(original)) {
    newValue.current = editCurrent === 'true';
  } else {
    newValue.current = editCurrent !== '' ? Number(editCurrent) : original.current;
  }

  return { current: newValue.current };
}
