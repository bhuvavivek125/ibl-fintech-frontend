import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import TableChartOutlined from '@mui/icons-material/TableChartOutlined';
import { updateRepeatLoanDpdBrackets } from 'api/bre-rule';
import { DpdBracket } from 'types/bre-rule';
import {
  columnHeaderSx,
  editButtonSx,
  monoFont,
  outlinedCancelButtonSx,
  pillSx,
  primaryButtonSx,
  sansFont,
  tableCardSx,
  tableColHeaderRowSx,
  tableHeaderBoxSx,
  thinFieldSx
} from '../styles';
import { BRE_REPEAT_LOAN_DECISION } from '../constants/breRules';
import { DecisionChip, EmptyState, IndexBubble } from './BreSharedUI';

const GRID = '44px 1fr 1fr 1fr';


function buildRuleLabel(bracket: DpdBracket, idx: number): string {
  if (bracket.dpd_max === null) return `Max DPD > ${bracket.dpd_min - 1} days`;
  if (idx === 0) return `Max DPD ≤ ${bracket.dpd_max} days`;
  return `Max DPD > ${bracket.dpd_min - 1} and ≤ ${bracket.dpd_max} days`;
}

interface DpdBracketsTableProps {
  brackets: DpdBracket[];
}

export function DpdBracketsTable({ brackets }: DpdBracketsTableProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<DpdBracket[]>([]);

  // Sync rows from props
  useEffect(() => {
    setRows(brackets.map((b) => ({ ...b })));
  }, [brackets]);

  const handleStartEdit = () => {
    setRows(brackets.map((b) => ({ ...b })));
    setEditing(true);
  };

  const handleCancel = () => {
    setRows(brackets.map((b) => ({ ...b })));
    setEditing(false);
  };

  const handleFieldChange = (idx: number, field: keyof DpdBracket, value: string | number | null) => {
    setRows((prev) => prev.map((row, i) => (i !== idx ? row : { ...row, [field]: value })));
  };

  const handleDecisionChange = (idx: number, value: string) => {
    setRows((prev) => prev.map((row, i) => (i !== idx ? row : { ...row, decision: value })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const bracketsPayload: Record<string, Partial<DpdBracket>> = {};
      rows.forEach((row, idx) => {
        bracketsPayload[String(idx)] = {
          dpd_min: row.dpd_min,
          ...(row.dpd_max !== null && { dpd_max: row.dpd_max }),
          decision: row.decision
        };
      });
      await updateRepeatLoanDpdBrackets(bracketsPayload);
      enqueueSnackbar('DPD brackets updated successfully', { variant: 'success' });
      setEditing(false);
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to update DPD brackets', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card sx={tableCardSx}>
      {/* Header */}
      <Box sx={tableHeaderBoxSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TableChartOutlined sx={{ fontSize: 22, color: '#2563EB' }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0F172A', fontFamily: sansFont }}>
              DPD Bracket Configuration
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#94A3B8', fontFamily: sansFont, mt: 0.25 }}>
              Previous loan Max DPD thresholds and decisions
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {editing ? (
            <>
              <Button size="small" onClick={handleCancel} disabled={saving} variant="outlined" sx={outlinedCancelButtonSx}>
                Cancel
              </Button>
              <Button
                size="small"
                onClick={handleSave}
                disabled={saving}
                variant="contained"
                startIcon={saving ? undefined : <SaveOutlined sx={{ fontSize: 15 }} />}
                sx={{ ...primaryButtonSx, minWidth: 110 }}
              >
                {saving ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button
              size="small"
              onClick={handleStartEdit}
              variant="outlined"
              startIcon={<EditOutlined sx={{ fontSize: 15 }} />}
              sx={editButtonSx}
            >
              Edit Brackets
            </Button>
          )}
        </Box>
      </Box>

      {/* Column headers */}
      <Box sx={{ ...tableColHeaderRowSx, display: 'grid', gridTemplateColumns: GRID, gap: 2 }}>
        <Typography sx={columnHeaderSx}>#</Typography>
        <Typography sx={columnHeaderSx}>Rule (Previous Loan Max DPD)</Typography>
        <Typography sx={columnHeaderSx}>DPD Range</Typography>
        <Typography sx={columnHeaderSx}>Decision</Typography>
      </Box>

      {/* Rows */}
      {rows.length === 0 ? (
        <EmptyState message="No DPD brackets configured" />
      ) : (
        rows.map((bracket, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'grid',
              gridTemplateColumns: GRID,
              gap: 2,
              px: 3,
              py: 1.75,
              alignItems: 'center',
              borderBottom: idx === rows.length - 1 ? 'none' : '1px solid #F1F5F9',
              transition: 'background 0.1s',
              '&:hover': { backgroundColor: '#FAFBFF' }
            }}
          >
            <IndexBubble index={idx + 1} />

            {/* Rule label */}
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#0F172A', fontFamily: sansFont }}>
              {buildRuleLabel(bracket, idx)}
            </Typography>

            {/* DPD Range */}
            {editing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  value={bracket.dpd_min}
                  onChange={(e) => handleFieldChange(idx, 'dpd_min', e.target.value === '' ? 0 : Number(e.target.value))}
                  type="number"
                  placeholder="Min"
                  sx={thinFieldSx}
                  inputProps={{ min: 0 }}
                />
                <Typography sx={{ color: '#94A3B8', fontSize: 12 }}>–</Typography>
                <TextField
                  size="small"
                  value={bracket.dpd_max === null ? '' : bracket.dpd_max}
                  onChange={(e) => handleFieldChange(idx, 'dpd_max', e.target.value === '' ? null : Number(e.target.value))}
                  type="number"
                  placeholder="∞"
                  sx={thinFieldSx}
                  inputProps={{ min: 0 }}
                />
              </Box>
            ) : (
              <Box sx={pillSx}>
                <Typography sx={{ fontWeight: 600, color: '#1E293B', fontFamily: monoFont, fontSize: 13 }}>
                  {bracket.dpd_min} – {bracket.dpd_max === null ? '∞' : bracket.dpd_max}
                </Typography>
              </Box>
            )}

            {/* Decision */}
            {editing ? (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={bracket.decision}
                  onChange={(e) => handleDecisionChange(idx, e.target.value)}
                  sx={{
                    borderRadius: '8px',
                    fontFamily: sansFont,
                    fontSize: 13,
                    fontWeight: 600,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#93C5FD' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3B82F6', borderWidth: 1.5 }
                  }}
                >
                  {Object.entries(BRE_REPEAT_LOAN_DECISION).map(([key, val]) => (
                    <MenuItem key={key} value={val} sx={{ fontFamily: sansFont, fontSize: 13, fontWeight: 500 }}>
                      <DecisionChip decision={val} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <DecisionChip decision={bracket.decision} />
            )}
          </Box>
        ))
      )}
    </Card>
  );
}
