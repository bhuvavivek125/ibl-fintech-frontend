import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Header from './Header';
import Sidebar from './Sidebar';
import MainContentStyled from './MainContentStyled';
import { useSelector, useDispatch } from 'store';
import { openDrawer, closeDrawer } from 'store/slices/menu';

export default function MainLayout() {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { isDashboardDrawerOpened } = useSelector((state) => state.menu);

  const handleDrawerToggle = () => {
    dispatch(isDashboardDrawerOpened ? closeDrawer() : openDrawer());
  };

  return (
    <h1>Welcome</h1>
  );
}