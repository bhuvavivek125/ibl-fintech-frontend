import { useState } from 'react';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddOutlined from '@mui/icons-material/AddOutlined';
import CycloneOutlined from '@mui/icons-material/CycloneOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { LoanExposureCycle } from 'types/bre-rule';
import { deleteLoanExposureCycle } from 'api/bre-rule';
import {
  columnHeaderSx,
  iconButtonBlueSx,
  monoFont,
  primaryButtonSx,
  sansFont,
  tableCardSx,
  tableColHeaderRowSx,
  tableHeaderBoxSx
} from '../styles';
import { CycleFormDialog } from './CycleFormDialog';
import { EmptyState } from './BreSharedUI';

const GRID = '80px 1fr 1fr 1fr 110px';

interface CyclesTableProps {
  cycles: LoanExposureCycle[];
  onRefresh: () => void;
}

export function CyclesTable({ cycles, onRefresh }: CyclesTableProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedCycle, setSelectedCycle] = useState<LoanExposureCycle | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cycleToDelete, setCycleToDelete] = useState<LoanExposureCycle | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const openAdd = () => {
    setDialogMode('create');
    setSelectedCycle(undefined);
    setDialogOpen(true);
  };

  const openEdit = (cycle: LoanExposureCycle) => {
    setDialogMode('edit');
    setSelectedCycle(cycle);
    setDialogOpen(true);
  };

  const openDelete = (cycle: LoanExposureCycle) => {
    setCycleToDelete(cycle);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cycleToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteLoanExposureCycle();
      enqueueSnackbar(response.message, { variant: 'success' });
      setDeleteConfirmOpen(false);
      setCycleToDelete(undefined);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to delete cycle', { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCycleToDelete(undefined);
  };

  const colVal = { fontFamily: monoFont, fontSize: 16, fontWeight: 600, color: '#1E293B' };

  return (
    <>
      <Card sx={tableCardSx}>
        {/* Header */}
        <Box sx={tableHeaderBoxSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CycloneOutlined sx={{ fontSize: 23, color: '#2563EB' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0F172A', fontFamily: sansFont }}>Cycle Configuration</Typography>
          </Box>
          <Button
            size="small"
            startIcon={<AddOutlined sx={{ fontSize: 16 }} />}
            onClick={openAdd}
            variant="contained"
            sx={{ ...primaryButtonSx, px: 2 }}
          >
            Add Cycle
          </Button>
        </Box>

        {/* Column headers */}  
        <Box sx={{ ...tableColHeaderRowSx, display: 'grid', gridTemplateColumns: GRID, gap: 2 }}>
          <Typography sx={columnHeaderSx}>Loan Cycle</Typography>
          <Typography sx={columnHeaderSx}>Default/Increment Amount</Typography>
          <Typography sx={columnHeaderSx}>Partial Increment Amount</Typography>
          <Typography sx={{ ...columnHeaderSx, textAlign: 'right' }}>Actions</Typography>
        </Box>

        {/* Rows */}
        {cycles.length === 0 ? (
          <EmptyState message="No cycles configured yet" />
        ) : (
          cycles.map((cycle, idx) => (
            <Box
              key={cycle.cycle_number}
              sx={{
                display: 'grid',
                gridTemplateColumns: GRID,
                gap: 2,
                px: 3,
                py: 1.75,
                alignItems: 'center',
                borderBottom: idx === cycles.length - 1 ? 'none' : '1px solid #F1F5F9',
                transition: 'background 0.1s',
                '&:hover': { backgroundColor: '#FAFBFF' }
              }}
            >
              {/* Cycle number badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    flexShrink: 0,
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: '#1D4ED8', fontFamily: monoFont }}>{cycle.cycle_number}</Typography>
                </Box>
              </Box>

              {/* Default amount */}
              <Typography sx={colVal}>₹{cycle.default_incremental_amount.toLocaleString('en-IN')}</Typography>

              {/* Partial amount */}
              <Typography sx={colVal}>
                {cycle.partial_increment_amount === 0 ? (
                  <span style={{ color: '#94A3B8' }}>—</span>
                ) : (
                  `₹${cycle.partial_increment_amount.toLocaleString('en-IN')}`
                )}
              </Typography>

              {/* Edit and Delete actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                <Tooltip title="Edit cycle" arrow>
                  <IconButton size="small" onClick={() => openEdit(cycle)} sx={{ ...iconButtonBlueSx, width: 30, height: 30 }}>
                    <EditOutlined sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
                {idx === cycles.length - 1 && cycles.length > 1 && (
                  <Tooltip title="Delete cycle" arrow>
                    <IconButton
                      size="small"
                      onClick={() => openDelete(cycle)}
                      sx={{ ...iconButtonBlueSx, width: 30, height: 30, color: '#EF4444 !important' }}
                    >
                      <DeleteOutlined sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          ))
        )}
      </Card>

      <CycleFormDialog
        open={dialogOpen}
        mode={dialogMode}
        cycle={selectedCycle}
        onClose={() => setDialogOpen(false)}
        onSuccess={onRefresh}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0' } }}
      >
        <DialogTitle sx={{ pb: 1.5, pt: 2.5, px: 3, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>
          Delete Cycle Configuration?
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography sx={{ fontFamily: sansFont, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
            Are you sure you want to delete Cycle {cycleToDelete?.cycle_number}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 13.5,
              border: '1px solid #E2E8F0',
              color: '#64748B',
              '&:hover': { backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={isDeleting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 13.5,
              backgroundColor: '#EF4444',
              '&:hover': { backgroundColor: '#DC2626' },
              '&:disabled': { backgroundColor: '#FECACA' }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
