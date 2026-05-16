import React from 'react';
import { Button as MuiButton, ButtonProps, CircularProgress, styled } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 20px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
}));

const Button: React.FC<CustomButtonProps> = ({ children, loading, disabled, startIcon, ...props }) => {
  return (
    <StyledButton
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
