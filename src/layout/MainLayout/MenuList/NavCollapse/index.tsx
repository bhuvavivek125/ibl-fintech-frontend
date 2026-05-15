import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import NavItem from '../NavItem';
import { NavItemType } from 'types';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

export default function NavCollapse({ menu, level }: { menu: NavItemType; level: number }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const Icon = menu.icon!;

  return (
    <>
      <ListItemButton
        sx={{
          mb: 0.5,
          alignItems: 'flex-start',
          backgroundColor: 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
          borderRadius: `8px`,
          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.main,
            '& .MuiListItemIcon-root': {
              color: theme.palette.secondary.main
            }
          },
          ...(open && {
            '& .MuiListItemIcon-root': {
              color: theme.palette.secondary.main
            }
          })
        }}
        onClick={() => setOpen(!open)}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>
          {menu.icon && <Icon size="20px" />}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={open ? 'h5' : 'body1'} color="inherit">
              {menu.title}
            </Typography>
          }
        />
        {open ? <IconChevronUp size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} /> : <IconChevronDown size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {menu.children?.map((item) => (
            item.type === 'collapse'
              ? <NavCollapse key={item.id} menu={item} level={level + 1} />
              : <NavItem key={item.id} item={item} level={level + 1} />
          ))}
        </List>
      </Collapse>
    </>
  );
}
