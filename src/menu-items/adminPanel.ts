// assets
import {
  IconSettings
} from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

const icons = {
  IconSettings: IconSettings
};

// ==============================|| MENU ITEMS - Admin Panel ||============================== //

const adminPanel: NavItemType = {
  id: 'main',
  type: 'group',
  children: [
    {
      id: 'dashboard-analytics',
      title: 'Dashboard Analytics',
      type: 'item',
      icon: icons.IconSettings,
      url: '/dashboard/analytics'
    },
  ]
};

export default adminPanel;
