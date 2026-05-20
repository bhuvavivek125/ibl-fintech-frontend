import { Theme } from '@mui/material/styles';

export default function ListItemText(theme: Theme) {
  return {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.vars.palette.text.dark
        }
      }
    }
  };
}
