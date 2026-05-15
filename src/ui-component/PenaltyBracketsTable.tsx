import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import PriceChangeOutlined from '@mui/icons-material/PriceChangeOutlined';
import { updateEmiMissedPenaltyBrackets } from 'api/bre-rule';
import { PenaltyBracket } from 'types/bre-rule';
import {
  columnHeaderSx,
  editButtonSx,
  monoFont,
  outlinedCancelButtonSx,
  primaryButtonSx,
  sansFont,
  tableCardSx,
  tableColHeaderRowSx,
  tableHeaderBoxSx,
  thinFieldSx
} from '../styles';
import { EmptyState, IndexBubble } from './BreSharedUI';

const GRID = '44px 1fr 1fr 1fr';

interface PenaltyBracketsTableProps {
  brackets: PenaltyBracket[];
}

export function PenaltyBracketsTable({ brackets }: PenaltyBracketsTableProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<PenaltyBracket[]>([]);

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

  const handleFieldChange = (idx: number, field: keyof PenaltyBracket, value: string | number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i !== idx
          ? row
          : {
              ...row,
              [field]: field === 'charges_in_rs' ? (value === '' ? 0 : Number(value)) : Number(value) || 0
            }
      )
    );
  };

  const handleSave = async () => {
    // Validate data
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.from_loan_amount < 0 || row.to_loan_amount < 0 || row.charges_in_rs < 0) {
        enqueueSnackbar('All values must be non-negative', { variant: 'error' });
        return;
      }
      if (row.from_loan_amount >= row.to_loan_amount) {
        enqueueSnackbar(`Row ${i + 1}: "From Amount" must be less than "To Amount"`, { variant: 'error' });
        return;
      }
    }

    setSaving(true);
    try {
      const bracketsPayload: Record<string, Partial<PenaltyBracket>> = {};
      rows.forEach((row, idx) => {
        bracketsPayload[String(idx)] = {
          from_loan_amount: row.from_loan_amount,
          to_loan_amount: row.to_loan_amount,
          charges_in_rs: row.charges_in_rs
        };
      });
      await updateEmiMissedPenaltyBrackets(bracketsPayload);
      enqueueSnackbar('Penalty brackets updated successfully', { variant: 'success' });
      setEditing(false);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to update penalty brackets', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card sx={tableCardSx}>
      {/* Header */}
      <Box sx={tableHeaderBoxSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PriceChangeOutlined sx={{ fontSize: 22, color: '#2563EB' }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0F172A', fontFamily: sansFont }}>
              EMI Missed Penalty Configuration
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#94A3B8', fontFamily: sansFont, mt: 0.25 }}>
              Penalty charges based on loan amount brackets
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
              Edit Penalties
            </Button>
          )}
        </Box>
      </Box>

      {/* Column headers */}
      <Box sx={{ ...tableColHeaderRowSx, display: 'grid', gridTemplateColumns: GRID, gap: 2 }}>
        <Typography sx={columnHeaderSx}>#</Typography>
        <Typography sx={columnHeaderSx}>Loan Amount Range (From)</Typography>
        <Typography sx={columnHeaderSx}>Loan Amount Range (To)</Typography>
        <Typography sx={columnHeaderSx}>Penalty Charges (₹)</Typography>
      </Box>

      {/* Rows */}
      {rows.length === 0 ? (
        <EmptyState message="No penalty brackets configured" />
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

            {/* From Loan Amount */}
            {editing ? (
              <TextField
                size="small"
                value={bracket.from_loan_amount}
                onChange={(e) => handleFieldChange(idx, 'from_loan_amount', e.target.value)}
                type="number"
                placeholder="From"
                sx={thinFieldSx}
                inputProps={{ min: 0 }}
              />
            ) : (
              <Typography sx={{ fontWeight: 600, fontSize:16, color: '#0F172A', fontFamily: monoFont }}>
                ₹{bracket.from_loan_amount.toLocaleString('en-IN')}
              </Typography>
            )}

            {/* To Loan Amount */}
            {editing ? (
              <TextField
                size="small"
                value={bracket.to_loan_amount}
                onChange={(e) => handleFieldChange(idx, 'to_loan_amount', e.target.value)}
                type="number"
                placeholder="To"
                sx={thinFieldSx}
                inputProps={{ min: 0 }}
              />
            ) : (
              <Typography sx={{ fontWeight: 600,  fontSize:16,color: '#0F172A', fontFamily: monoFont }}>
                ₹{bracket.to_loan_amount.toLocaleString('en-IN')}
              </Typography>
            )}

            {/* Penalty Charges */}
            {editing ? (
              <TextField
                size="small"
                value={bracket.charges_in_rs}
                onChange={(e) => handleFieldChange(idx, 'charges_in_rs', e.target.value)}
                type="number"
                placeholder="Charges"
                sx={thinFieldSx}
                inputProps={{ min: 0 }}
              />
            ) : (
              <Typography sx={{ fontWeight: 600,  fontSize:16,color: '#16A34A', fontFamily: monoFont }}>
                ₹{bracket.charges_in_rs.toLocaleString('en-IN')}
              </Typography>
            )}
          </Box>
        ))
      )}
    </Card>
  );
}
