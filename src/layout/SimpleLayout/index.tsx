import { Outlet } from 'react-router-dom';

import { styled } from '@mui/material/styles';

import Customization from 'layout/Customization';
import AppBar from 'ui-component/extended/AppBar';

const headerBackground = '/assets/images/landing/bg-header.jpg';
const HeaderWrapper = styled('div')(({ theme }) => ({
  backgroundImage: `url(${headerBackground})`,
  backgroundSize: '100% 600px',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  paddingTop: 30,
  [theme.breakpoints.down('md')]: {
    paddingTop: 0
  }
}));

export default function SimpleLayout() {
  return (
    <HeaderWrapper>
      <AppBar />
      <Outlet />
      <Customization />
    </HeaderWrapper>
  );
}
