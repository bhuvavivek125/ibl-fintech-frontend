import { IconCalendar, IconFolder } from '@tabler/icons-react';
import { NavItemType } from 'types';

const icons = {
  IconCalendar: IconCalendar,
  IconFolder: IconFolder
};

const dashboard: NavItemType = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'plan',
      title: 'Plan',
      type: 'item',
      icon: icons.IconCalendar,
      url: '/plan'
    },
    {
      id: 'project',
      title: 'Project',
      type: 'item',
      icon: icons.IconFolder,
      url: '/project'
    }
  ]
};

export default dashboard;
