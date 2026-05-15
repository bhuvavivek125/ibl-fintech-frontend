// Font Families

export const monoFont = '"DM Mono", "Fira Mono", monospace';
export const sansFont = '"DM Sans", "Inter", sans-serif';

// Reusable sx objects

export const pillSx = {
  px: 1.5,
  py: 0.5,
  borderRadius: '6px',
  border: '1px solid #E2E8F0',
  backgroundColor: '#F8FAFC',
  display: 'inline-flex',
  alignItems: 'center'
} as const;

export const columnHeaderSx = {
  fontWeight: 700,
  fontSize: 11,
  color: '#94A3B8',
  letterSpacing: '0.07em',
  textTransform: 'uppercase' as const,
  fontFamily: sansFont
};

export const thinFieldSx = {
  width: 80,
  '& input': { padding: '5px 8px', fontFamily: monoFont, fontSize: 13 },
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#93C5FD' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3B82F6', borderWidth: 1.5 }
  }
} as const;

export const outlinedFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: monoFont,
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#93C5FD' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3B82F6', borderWidth: 1.5 }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3B82F6' }
} as const;

export const primaryButtonSx = {
  borderRadius: '8px',
  textTransform: 'none',
  fontFamily: sansFont,
  fontWeight: 600,
  backgroundColor: '#2563EB',
  boxShadow: 'none',
  '&:hover': { backgroundColor: '#1D4ED8', boxShadow: 'none' }
} as const;

export const outlinedCancelButtonSx = {
  borderRadius: '8px',
  textTransform: 'none',
  fontFamily: sansFont,
  fontWeight: 600,
  borderColor: '#E2E8F0',
  color: '#64748B',
  '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }
} as const;

export const editButtonSx = {
  borderRadius: '8px',
  textTransform: 'none',
  fontFamily: sansFont,
  fontWeight: 600,
  borderColor: '#BFDBFE',
  color: '#2563EB',
  backgroundColor: '#EFF6FF',
  '&:hover': { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' }
} as const;

export const iconButtonBlueSx = {
  color: '#3B82F6',
  backgroundColor: '#EFF6FF',
  border: '1px solid #BFDBFE',
  width: 28,
  height: 28,
  '&:hover': { backgroundColor: '#DBEAFE' },
  '&:disabled': { opacity: 0.35 }
} as const;

export const iconButtonGreenSx = {
  color: '#16A34A',
  backgroundColor: '#F0FDF4',
  border: '1px solid #BBF7D0',
  width: 28,
  height: 28,
  '&:hover': { backgroundColor: '#DCFCE7' }
} as const;

export const iconButtonRedSx = {
  color: '#DC2626',
  backgroundColor: '#FFF1F2',
  border: '1px solid #FECDD3',
  width: 28,
  height: 28,
  '&:hover': { backgroundColor: '#FFE4E6' }
} as const;

export const tableCardSx = {
  border: '1px solid #E2E8F0',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  borderRadius: '12px',
  overflow: 'hidden',
  mt: 3
} as const;

export const tableHeaderBoxSx = {
  px: 3,
  py: 2,
  borderBottom: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#FAFBFF'
} as const;

export const tableColHeaderRowSx = {
  px: 3,
  py: 1.25,
  backgroundColor: '#F8FAFC',
  borderBottom: '1px solid #F1F5F9'
} as const;

export const indexBubbleSx = {
  width: 26,
  height: 26,
  borderRadius: '50%',
  backgroundColor: '#EFF6FF',
  border: '1px solid #BFDBFE',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 11,
  fontFamily: monoFont,
  color: '#1D4ED8',
  flexShrink: 0
} as const;
