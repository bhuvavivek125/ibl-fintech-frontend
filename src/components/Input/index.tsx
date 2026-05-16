import React from 'react';
import { TextField, TextFieldProps, styled } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px'
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500
  }
}));

const Input: React.FC<TextFieldProps> = (props) => {
  return <StyledTextField fullWidth variant="outlined" {...props} />;
};

export default Input;
