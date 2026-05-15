import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { BRERule, RuleValue } from 'types/bre-rule';

import { RuleValueDisplay, RuleValueEditor } from './RuleValueField';
import { InlineEditActions } from './InlineEditActions';
import { IndexBubble } from './BreSharedUI';
import { buildRuleValuePayload, toStr, extractVariableNames, getRuleVariableValue } from 'utils/ruleHelpers';
import { sansFont } from 'styles';

interface RuleRowProps {
  rule: BRERule;
  index: number;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onSaveValue: (id: string, value: RuleValue) => Promise<void>;
}

export const RuleRow = memo(function RuleRow({ rule, index, onToggle, onSaveValue }: RuleRowProps) {
  const [editingVariable, setEditingVariable] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Variables to exclude from display
  const EXCLUDED_VARIABLES = ['max_total_exposure', 'status'];

  // Extract variable names from config (only numeric and string values, exclude boolean)
  const configVariables = useMemo(() => {
    if (rule.config && typeof rule.config === 'object') {
      return Object.keys(rule.config).filter((key) => {
        const val = rule.config[key];
        // Only include numeric and string values (exclude boolean and other types)
        const isNumericOrString = val !== null && val !== undefined && (typeof val === 'string' || typeof val === 'number');
        const isNotExcluded = !EXCLUDED_VARIABLES.includes(key);
        return isNumericOrString && isNotExcluded;
      });
    }
    return [];
  }, [rule.config]);

  const descriptionVariables = useMemo(() => extractVariableNames(rule.description), [rule.description]);
  const allVariables = configVariables.length > 0 ? configVariables : descriptionVariables;

  const [editCurrent, setEditCurrent] = useState(() => toStr(rule.value.current));
  const [editMin, setEditMin] = useState(() => toStr(rule.value.min));
  const [editMax, setEditMax] = useState(() => toStr(rule.value.max));
  const [editVariables, setEditVariables] = useState<Record<string, string>>(() => {
    const vars: Record<string, string> = {};
    for (const varName of allVariables) {
      const val = getRuleVariableValue(rule, varName);
      vars[varName] = toStr(val);
    }
    return vars;
  });

  // Sync fields when rule value changes externally (e.g. after refresh)
  useEffect(() => {
    if (editingVariable === null) {
      setEditCurrent(toStr(rule.value.current));
      setEditMin(toStr(rule.value.min));
      setEditMax(toStr(rule.value.max));

      const vars: Record<string, string> = {};
      for (const varName of allVariables) {
        const val = getRuleVariableValue(rule, varName);
        vars[varName] = toStr(val);
      }
      setEditVariables(vars);
    }
  }, [rule.value, rule.config, editingVariable, allVariables]);

  const showEditActions = editingVariable !== null;

  const handleToggle = useCallback(async () => {
    setToggling(true);
    try {
      await onToggle(rule._id, !rule.isActive);
    } finally {
      setToggling(false);
    }
  }, [onToggle, rule._id, rule.isActive]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (editingVariable === 'current') {
        // Update the current value
        const payload = buildRuleValuePayload(rule.value, editCurrent, editMin, editMax);
        await onSaveValue(rule._id, payload as RuleValue);
      } else if (editingVariable === 'range') {
        // Update the range (min/max)
        const payload = buildRuleValuePayload(rule.value, editCurrent, editMin, editMax);
        await onSaveValue(rule._id, payload as RuleValue);
      } else if (editingVariable && editVariables && editingVariable in editVariables) {
        // Update a config variable
        const updatedVars: Record<string, any> = { ...editVariables };
        const numVal = Number(updatedVars[editingVariable]);
        updatedVars[editingVariable] = isNaN(numVal) ? updatedVars[editingVariable] : numVal;

        const payload = buildRuleValuePayload(rule.value, editCurrent, editMin, editMax);
        (payload as any).variables = updatedVars;
        await onSaveValue(rule._id, payload as RuleValue);
      }
      setEditingVariable(null);
    } finally {
      setSaving(false);
    }
  }, [rule, editCurrent, editMin, editMax, editVariables, editingVariable, onSaveValue]);

  const handleCancel = useCallback(() => {
    setEditCurrent(toStr(rule.value.current));
    setEditMin(toStr(rule.value.min));
    setEditMax(toStr(rule.value.max));

    const vars: Record<string, string> = {};
    for (const varName of allVariables) {
      const val = getRuleVariableValue(rule, varName);
      vars[varName] = toStr(val);
    }
    setEditVariables(vars);
    setEditingVariable(null);
  }, [rule.value, rule.config, allVariables]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3,
        py: 1.75,
        minHeight: 60,
        borderBottom: '1px solid #F1F5F9',
        opacity: rule.isActive ? 1 : 0.5,
        transition: 'background 0.12s',
        '&:last-child': { borderBottom: 'none' },
        '&:hover': { backgroundColor: '#FAFBFF' }
      }}
    >
      {/* Index */}
      <IndexBubble index={index + 1} isActive={rule.isActive} />

      {/* Rule Name */}
      <Box sx={{ minWidth: 200, flexShrink: 0 }}>
        <Typography
          sx={{ fontWeight: 600, fontSize: 13.5, color: rule.isActive ? '#0F172A' : '#94A3B8', fontFamily: sansFont, lineHeight: 1.3 }}
        >
          {rule.ruleName}
        </Typography>
      </Box>

      {/* Description */}
      <Tooltip title={rule.description} placement="top" arrow>
        <Typography
          sx={{
            color: '#64748B',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: sansFont,
            fontSize: 13,
            cursor: 'default'
          }}
        >
          {rule.description}
        </Typography>
      </Tooltip>

      {/* Value field */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, minWidth: 220 }}>
        {editingVariable ? (
          <RuleValueEditor
            value={rule.value}
            editCurrent={editCurrent}
            editMin={editMin}
            editMax={editMax}
            editVariables={editVariables}
            editingVariable={editingVariable}
            onCurrentChange={setEditCurrent}
            onMinChange={setEditMin}
            onMaxChange={setEditMax}
            onVariableChange={(key, val) => setEditVariables((prev) => ({ ...prev, [key]: val }))}
          />
        ) : (
          <RuleValueDisplay value={rule.value} rule={rule} onEditVariable={setEditingVariable} />
        )}

        {showEditActions && (
          <InlineEditActions
            editing={editingVariable !== null}
            saving={saving}
            disabled={!rule.isActive}
            onEdit={() => {}} // Not used since we have individual edit buttons
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </Box>

      {/* Active toggle */}
      <Box sx={{ flexShrink: 0, ml: 'auto' }}>
        {toggling ? (
          <CircularProgress size={18} sx={{ color: '#3B82F6' }} />
        ) : (
          <Switch
            checked={rule.isActive}
            onChange={handleToggle}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563EB', opacity: 1 },
              '& .MuiSwitch-track': { backgroundColor: '#CBD5E1', opacity: 1 }
            }}
          />
        )}
      </Box>
    </Box>
  );
});
