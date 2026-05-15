import { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

export interface MainCardProps {
  children: ReactNode;
  title?: ReactNode;
  secondary?: ReactNode;
  sx?: any;
}

export default function MainCard({ children, title, secondary, sx = {} }: MainCardProps) {
  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider', ...sx }}>
      {title && <CardHeader title={title} action={secondary} />}
      {title && <Divider />}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
