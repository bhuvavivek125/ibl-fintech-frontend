// assets
import {
  IconDashboard,
  IconUsers,
  IconUpload,
  IconLock,
  IconSettings,
  IconHistory
} from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

const icons = {
  IconDashboard,
  IconUsers,
  IconUpload,
  IconLock,
  IconSettings,
  IconHistory
};

// ==============================|| MENU ITEMS - Admin Panel ||============================== //

const adminPanel: NavItemType = {
  id: 'admin-panel',
  title: 'Admin Panel',
  type: 'group',
  children: [
    {
      id: 'admin-dashboard',
      title: 'Admin Dashboard',
      type: 'item',
      icon: icons.IconDashboard,
      url: '/dashboard/admin',
      permission: 'dashboard.view'
    },
    {
      id: 'user-management',
      title: 'User Management',
      type: 'item',
      icon: icons.IconUsers,
      url: '/users',
      permission: 'user.view'
    },
    {
      id: 'role-management',
      title: 'Role & Permission',
      type: 'item',
      icon: icons.IconLock,
      url: '/roles',
      permission: 'role.view'
    },
    {
      id: 'file-upload',
      title: 'File Upload',
      type: 'item',
      icon: icons.IconUpload,
      url: '/upload',
      permission: 'file.view'
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      icon: icons.IconSettings,
      url: '/settings',
      permission: 'settings.view'
    },
    {
      id: 'activity-logs',
      title: 'Activity Logs',
      type: 'item',
      icon: icons.IconHistory,
      url: '/activity-logs',
      permission: 'activity.view'
    }
  ]
};

export default adminPanel;

