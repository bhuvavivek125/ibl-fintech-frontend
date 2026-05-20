import { Theme } from '@mui/material/styles';

export default function TimelineContent(theme: Theme) {
  return {
    MuiTimelineContent: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.dark,
          fontSize: '16px'
        }
      }
    }
  };
}
