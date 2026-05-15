import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { DECISION_COLOR, DECISION_LABEL } from 'constants/breRules';
import { indexBubbleSx, monoFont, sansFont } from 'styles';

// DecisionChip

interface DecisionChipProps {
  decision: string;
}

export function DecisionChip({ decision }: DecisionChipProps) {
  const style = DECISION_COLOR[decision] ?? { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.4,
        borderRadius: '6px',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 12.5, color: style.color, fontFamily: sansFont, whiteSpace: 'nowrap' }}>
        {DECISION_LABEL[decision] ?? decision}
      </Typography>
    </Box>
  );
}

// ─── IndexBubble ─────────────────────────────────────────────────────────────

interface IndexBubbleProps {
  index: number;
  isActive?: boolean;
}

export function IndexBubble({ index, isActive = true }: IndexBubbleProps) {
  return (
    <Box
      sx={{
        ...indexBubbleSx,
        backgroundColor: isActive ? '#EFF6FF' : '#F1F5F9',
        color: isActive ? '#1D4ED8' : '#94A3B8'
      }}
    >
      {index}
    </Box>
  );
}

// ─── LoadingSpinner ──────────────────────────────────────────────────────────

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export function LoadingSpinner({ size = 28, color = '#3B82F6' }: LoadingSpinnerProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 7 }}>
      <CircularProgress size={size} sx={{ color }} />
    </Box>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 7, color: '#94A3B8' }}>
      <Typography sx={{ fontFamily: sansFont, fontSize: 13 }}>{message}</Typography>
    </Box>
  );
}

// ─── MonoPill ─────────────────────────────────────────────────────────────────

interface MonoPillProps {
  children: React.ReactNode;
}

export function MonoPill({ children }: MonoPillProps) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: '6px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#F8FAFC',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      <Typography sx={{ fontWeight: 600, color: '#1E293B', fontFamily: monoFont, fontSize: 13 }}>{children}</Typography>
    </Box>
  );
}
