import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing

const Error = Loadable(lazy(() => import('views/Error')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // {
    //   index: true,
    //   element: <Navigate to="/plan" replace />
    // },
  ]
};

const MaintenanceErrorRoute = {
  path: '/*',
  element: <Error />
};

export default [MainRoutes, MaintenanceErrorRoute];
