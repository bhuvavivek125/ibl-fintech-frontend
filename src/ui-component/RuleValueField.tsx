import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { RuleValue, BRERule } from 'types/bre-rule';
import { MonoPill } from './BreSharedUI';
import { monoFont, thinFieldSx } from 'styles';
import { formatRupee, isBetweenRule, isBooleanRule, isNumericRule, extractVariableNames, getRuleVariableValue } from 'utils/ruleHelpers';
import { OPERATOR_LABEL } from 'constants/breRules';

// RuleValueDisplay — read-only

interface RuleValueDisplayProps {
  value: RuleValue;
  rule?: BRERule; // Optional full rule to extract variables from description
  onEditVariable?: (varName: string) => void; // Callback when edit button is clicked for a specific variable
}

export function RuleValueDisplay({ value, rule, onEditVariable }: RuleValueDisplayProps) {
  // Hide boolean rules completely - no UI elements
  if (isBooleanRule(value)) {
    return null;
  }

  // Variables to exclude from display
  const EXCLUDED_VARIABLES = ['max_total_exposure', 'status'];

  // If rule has config with numeric/string variables, display them alongside the main value
  if (rule && rule.config && Object.keys(rule.config).length > 0) {
    const scalarVars = Object.entries(rule.config).filter(([key, val]) => {
      // Only include numeric and string values (exclude boolean and other types)
      const isNumericOrString = val !== null && val !== undefined && (typeof val === 'string' || typeof val === 'number');
      const isNotExcluded = !EXCLUDED_VARIABLES.includes(key);
      return isNumericOrString && isNotExcluded;
    });

    if (scalarVars.length > 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Display main value if it exists */}
          {value.current !== null && value.current !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>current:</Typography>
                <MonoPill>{typeof value.current === 'number' ? formatRupee(value.current) : String(value.current)}</MonoPill>
              </Box>
              {onEditVariable && (
                <Tooltip title="Edit current" arrow>
                  <IconButton size="small" onClick={() => onEditVariable('current')} sx={{ width: 24, height: 24, color: '#3B82F6' }}>
                    <EditOutlined sx={{ fontSize: 13 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
          {/* Display config scalar variables */}
          {scalarVars.map(([key, val]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{key}:</Typography>
                <MonoPill>{typeof val === 'number' ? formatRupee(val) : String(val)}</MonoPill>
              </Box>
              {onEditVariable && (
                <Tooltip title={`Edit ${key}`} arrow>
                  <IconButton size="small" onClick={() => onEditVariable(key)} sx={{ width: 24, height: 24, color: '#3B82F6' }}>
                    <EditOutlined sx={{ fontSize: 13 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
        </Box>
      );
    }
  }

  // If rule has description with variables, display them
  if (rule) {
    const descVars = extractVariableNames(rule.description);
    if (descVars.length > 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {descVars.map((varName) => {
            const val = getRuleVariableValue(rule, varName);
            return val !== null ? (
              <Box key={varName} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{varName}:</Typography>
                <MonoPill>{typeof val === 'number' ? formatRupee(val) : String(val)}</MonoPill>
              </Box>
            ) : null;
          })}
        </Box>
      );
    }
  }

  // If rule has multiple variables, display them
  if (value.variables && Object.keys(value.variables).length > 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {Object.entries(value.variables).map(([key, val]) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{key}:</Typography>
            <MonoPill>{typeof val === 'number' ? formatRupee(val) : String(val)}</MonoPill>
          </Box>
        ))}
      </Box>
    );
  }

  const opSymbol = OPERATOR_LABEL[value.operator] ?? value.operator;

  if (isBetweenRule(value)) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>Range</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MonoPill>
            {value.min} – {value.max}
          </MonoPill>
          {onEditVariable && (
            <Tooltip title="Edit range" arrow>
              <IconButton size="small" onClick={() => onEditVariable('range')} sx={{ width: 24, height: 24, color: '#3B82F6' }}>
                <EditOutlined sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  }

  if (isNumericRule(value)) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{opSymbol}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MonoPill>{typeof value.current === 'number' ? formatRupee(value.current) : value.current}</MonoPill>
          {onEditVariable && (
            <Tooltip title="Edit value" arrow>
              <IconButton size="small" onClick={() => onEditVariable('current')} sx={{ width: 24, height: 24, color: '#3B82F6' }}>
                <EditOutlined sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{opSymbol}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <MonoPill>{typeof value.current === 'number' ? formatRupee(value.current) : value.current}</MonoPill>
        {onEditVariable && (
          <Tooltip title="Edit value" arrow>
            <IconButton size="small" onClick={() => onEditVariable('current')} sx={{ width: 24, height: 24, color: '#3B82F6' }}>
              <EditOutlined sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

// ─── RuleValueEditor — editable ──────────────────────────────────────────────

interface RuleValueEditorProps {
  value: RuleValue;
  editCurrent: string;
  editMin: string;
  editMax: string;
  editVariables?: Record<string, string>;
  editingVariable?: string | null; // Which variable is currently being edited
  onCurrentChange: (v: string) => void;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  onVariableChange?: (key: string, val: string) => void;
}

export function RuleValueEditor({
  value,
  editCurrent,
  editMin,
  editMax,
  editVariables,
  editingVariable,
  onCurrentChange,
  onMinChange,
  onMaxChange,
  onVariableChange
}: RuleValueEditorProps) {
  // Hide boolean rules completely - no UI elements
  if (isBooleanRule(value)) {
    return null;
  }

  // If editing a specific variable, show only that input field
  if (editingVariable && editVariables && editingVariable in editVariables) {
    const val = editVariables[editingVariable];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{editingVariable}:</Typography>
        <TextField
          size="small"
          value={val}
          onChange={(e) => onVariableChange?.(editingVariable, e.target.value)}
          type="number"
          autoFocus
          sx={{ ...thinFieldSx, width: 100 }}
        />
      </Box>
    );
  }

  const opSymbol = OPERATOR_LABEL[value.operator] ?? value.operator;

  // If editing range
  if (editingVariable === 'range') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>Range</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField size="small" value={editMin} onChange={(e) => onMinChange(e.target.value)} type="number" sx={thinFieldSx} autoFocus />
          <Typography sx={{ color: '#94A3B8', fontSize: 12 }}>–</Typography>
          <TextField size="small" value={editMax} onChange={(e) => onMaxChange(e.target.value)} type="number" sx={thinFieldSx} />
        </Box>
      </Box>
    );
  }

  // If editing numeric value
  if (editingVariable === 'current') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{opSymbol}</Typography>
        </Box>
        <TextField
          size="small"
          value={editCurrent}
          onChange={(e) => onCurrentChange(e.target.value)}
          type="number"
          autoFocus
          sx={{ ...thinFieldSx, width: 110 }}
        />
      </Box>
    );
  }

  if (isBetweenRule(value)) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>Range</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField size="small" value={editMin} onChange={(e) => onMinChange(e.target.value)} type="number" sx={thinFieldSx} />
          <Typography sx={{ color: '#94A3B8', fontSize: 12 }}>–</Typography>
          <TextField size="small" value={editMax} onChange={(e) => onMaxChange(e.target.value)} type="number" sx={thinFieldSx} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ color: '#94A3B8', fontWeight: 500, fontFamily: monoFont, fontSize: 12 }}>{opSymbol}</Typography>
      </Box>
      <TextField
        size="small"
        value={editCurrent}
        onChange={(e) => onCurrentChange(e.target.value)}
        type="number"
        sx={{ ...thinFieldSx, width: 110 }}
      />
    </Box>
  );
}
