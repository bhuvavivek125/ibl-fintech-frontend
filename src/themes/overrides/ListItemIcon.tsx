import { Theme } from '@mui/material/styles';

export default function ListItemIcon(theme: Theme) {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.primary,
          minWidth: '36px'
        }
      }
    }
  };
}
