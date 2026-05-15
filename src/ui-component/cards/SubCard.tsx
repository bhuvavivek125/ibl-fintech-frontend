import { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

export default function SubCard({ children, title, sx = {} }: { children: ReactNode; title?: ReactNode; sx?: any }) {
  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider', ...sx }}>
      {title && <CardHeader title={title} />}
      {title && <Divider />}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
