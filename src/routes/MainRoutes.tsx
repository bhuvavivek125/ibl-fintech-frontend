import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


import AuthGuard from 'utils/route-guard/AuthGuard';
import GuestGuard from 'utils/route-guard/GuestGuard';
import AdminAuthGuard from 'utils/route-guard/AdminAuthGuard';
import AdminGuestGuard from 'utils/route-guard/AdminGuestGuard';
import PermissionGuard from 'utils/route-guard/PermissionGuard';

// dashboard routing
const Login = Loadable(lazy(() => import('views/login')));
const Register = Loadable(lazy(() => import('views/register')));
const AdminLogin = Loadable(lazy(() => import('views/AdminLogin')));


const AdminDashboard = Loadable(lazy(() => import('views/admin/dashboard')));
const UserManagement = Loadable(lazy(() => import('views/admin/users/UserList')));
const RoleManagement = Loadable(lazy(() => import('views/admin/roles/RoleManagement')));
const FileUpload = Loadable(lazy(() => import('views/admin/upload/FileUpload')));
const ActivityLogs = Loadable(lazy(() => import('views/admin/activity/ActivityLogs')));
const AccessDenied = Loadable(lazy(() => import('views/AccessDeniedPage')));
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
    <GuestGuard>
      <Login />
    </GuestGuard>
  ),
};

const RegisterRoutes = {
  path: '/register',
  element: (
    <GuestGuard>
      <Register />
    </GuestGuard>
  ),
};

const AdminLoginRoutes = {
  path: '/admin/login',
  element: (
    <AdminGuestGuard>
      <AdminLogin />
    </AdminGuestGuard>
  ),
};

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <Navigate to="/dashboard/admin" replace />
    },
    {
      path: '/dashboard/admin',
      element: <AdminDashboard />
    },
    {
      path: '/users',
      element: (
        <PermissionGuard permission="user.view">
          <UserManagement />
        </PermissionGuard>
      )
    },
    {
      path: '/roles',
      element: (
        <PermissionGuard permission="role.view">
          <RoleManagement />
        </PermissionGuard>
      )
    },
    {
      path: '/upload',
      element: (
        <PermissionGuard permission="file.upload">
          <FileUpload />
        </PermissionGuard>
      )
    },
    {
      path: '/activity-logs',
      element: (
        <PermissionGuard permission="activity.view">
          <ActivityLogs />
        </PermissionGuard>
      )
    },
    {
      path: '/access-denied',
      element: <AccessDenied />
    }
  ]
};






export default [RegisterRoutes, LoginRoutes, AdminLoginRoutes, MainRoutes, MaintenanceErrorRoute];

