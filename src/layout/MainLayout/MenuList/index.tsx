import { memo } from 'react';
import Box from '@mui/material/Box';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

function MenuList() {
  return (
    <Box>
      {menuItem.items.map((item) => (
        <NavGroup key={item.id} item={item} />
      ))}
    </Box>
  );
}

export default memo(MenuList);
