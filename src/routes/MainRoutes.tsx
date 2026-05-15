import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


// dashboard routing
const Login = Loadable(lazy(() => import('views/login')));
const Register = Loadable(lazy(() => import('views/register')));


const DashboardAnalytics = Loadable(lazy(() => import('views/dashboard/Analytics')));
const Error = Loadable(lazy(() => import('views/Error')));
// ==============================|| MAIN ROUTING ||============================== //

const MaintenanceErrorRoute = {
  path: '/*',
  element: <Error />
};


// Main Dashboard Route 

const LoginRoutes = {
  path: '/login',
  element: (
    <Login />
  ),
};

const RegisterRoutes = {
  path: '/register',
  element: (
    <Register />
  ),
};

const MainRoutes = {
  path: '/',
  element: (
    <MainLayout />
  ),
  children: [
    {
      path: '/dashboard/analytics',
      element: <DashboardAnalytics />
    }
  ]
};



export default [RegisterRoutes, LoginRoutes, MainRoutes, MaintenanceErrorRoute];
