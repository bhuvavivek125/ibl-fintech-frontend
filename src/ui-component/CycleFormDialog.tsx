import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CycloneOutlined from '@mui/icons-material/CycloneOutlined';
import { createLoanExposureCycle, updateLoanExposureCycle } from 'api/bre-rule';
import { LoanExposureCycle } from 'types/bre-rule';
import { outlinedCancelButtonSx, outlinedFieldSx, primaryButtonSx, sansFont } from '../styles';

interface CycleFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  cycle?: LoanExposureCycle;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  default?: string;
  partial?: string;
}

export function CycleFormDialog({ open, mode, cycle, onClose, onSuccess }: CycleFormDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [defaultAmt, setDefaultAmt] = useState('');
  const [partialAmt, setPartialAmt] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setDefaultAmt(mode === 'edit' && cycle ? String(cycle.default_incremental_amount) : '');
      setPartialAmt(mode === 'edit' && cycle ? String(cycle.partial_increment_amount) : '');
      setErrors({});
    }
  }, [open, mode, cycle]);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    const def = Number(defaultAmt);
    const par = Number(partialAmt);
    if (defaultAmt === '' || isNaN(def) || def < 0) errs.default = 'Must be a non-negative integer';
    if (partialAmt === '' || isNaN(par) || par < 0) errs.partial = 'Must be a non-negative integer';
    if (!errs.default && !errs.partial && def < par) errs.default = 'Default must be ≥ partial amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        default_incremental_amount: Number(defaultAmt),
        partial_increment_amount: Number(partialAmt)
      };
      if (mode === 'create') {
        await createLoanExposureCycle(body);
        enqueueSnackbar('Cycle created successfully', { variant: 'success' });
      } else if (cycle) {
        await updateLoanExposureCycle(cycle.cycle_number, body);
        enqueueSnackbar('Cycle updated successfully', { variant: 'success' });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || 'Operation failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0' } }}
    >
      <DialogTitle sx={{ pb: 1.5, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CycloneOutlined sx={{ fontSize: 18, color: '#2563EB' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#0F172A', fontFamily: sansFont, lineHeight: 1.2 }}>
              {mode === 'create' ? 'Add New Cycle' : `Edit Cycle ${cycle?.cycle_number}`}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#94A3B8', fontFamily: sansFont }}>
              {mode === 'create' ? 'Cycle number is auto-assigned' : 'Update increment amounts'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Default Incremental Amount (₹)"
            value={defaultAmt}
            onChange={(e) => setDefaultAmt(e.target.value)}
            type="number"
            fullWidth
            size="small"
            error={!!errors.default}
            helperText={errors.default || 'Applied when repayment is complete'}
            inputProps={{ min: 0 }}
            sx={outlinedFieldSx}
          />
          <TextField
            label="Partial Increment Amount (₹)"
            value={partialAmt}
            onChange={(e) => setPartialAmt(e.target.value)}
            type="number"
            fullWidth
            size="small"
            error={!!errors.partial}
            helperText={errors.partial || 'Applied when repayment is partial'}
            inputProps={{ min: 0 }}
            sx={outlinedFieldSx}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
        <Button onClick={onClose} size="small" variant="outlined" disabled={saving} sx={outlinedCancelButtonSx}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} size="small" variant="contained" disabled={saving} sx={{ ...primaryButtonSx, minWidth: 90 }}>
          {saving ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : mode === 'create' ? 'Add Cycle' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}