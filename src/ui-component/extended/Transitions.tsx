import { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

export default function Transitions({ children, in: open, ...others }: { children: ReactElement; in?: boolean; [key: string]: any }) {
  return (
    <Fade in={open} {...others}>
      <Box>{children}</Box>
    </Fade>
  );
}
