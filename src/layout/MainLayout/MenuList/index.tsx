import { Activity, memo, useLayoutEffect, useState, useContext } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import { MenuOrientation } from 'config';
import menuItem from 'menu-items';
import useConfig from 'hooks/useConfig';
import AdminAuthContext from 'contexts/AdminAuthContext';
import { filterMenuByPermissions, createAllowedModulesSet } from 'utils/filterMenuByPermissions';

import { HORIZONTAL_MAX_ITEM } from 'config';

// types
import { NavItemType } from 'types';

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const adminAuthContext = useContext(AdminAuthContext);

  const {
    state: { menuOrientation }
  } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const [selectedID, setSelectedID] = useState<string | undefined>('');
  const [menuItems, setMenuItems] = useState<{ items: NavItemType[] }>({ items: [] });

  // let widgetMenu = Menu();

  useLayoutEffect(() => {
    let finalMenuItems = [...menuItem.items];

    // Apply permission-based filtering if permissions are available
    const permissionsResponse = adminAuthContext?.permissions as any;
    const effectivePermissions = permissionsResponse?.data?.effectivePermissions;

    if (effectivePermissions && Array.isArray(effectivePermissions) && effectivePermissions.length > 0) {
      const allowedModules = createAllowedModulesSet(effectivePermissions);

      finalMenuItems = filterMenuByPermissions(finalMenuItems, allowedModules);
    } else {
      console.log('[MenuList] No permissions available');
    }

      setMenuItems({ items: finalMenuItems });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ adminAuthContext?.permissions]);

  // last menu-item to show in horizontal menu bar
  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;

  let lastItemIndex = menuItems.items.length - 1;
  let remItems: NavItemType[] = [];
  let lastItemId: string;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navItems = menuItems.items.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem item={item} level={1} isParents setSelectedID={() => setSelectedID('')} />
              <Activity mode={!isHorizontal && index !== 0 ? 'visible' : 'hidden'}>
                <Divider sx={{ py: 0.5 }} />
              </Activity>
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem!}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" align="center" sx={{ color: 'error.main' }}>
            Menu Items Error
          </Typography>
        );
    }
  });

  return !isHorizontal ? <Box>{navItems}</Box> : <>{navItems}</>;
}

export default memo(MenuList);
