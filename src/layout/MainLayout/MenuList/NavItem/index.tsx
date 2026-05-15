import { Link, matchPath, useLocation } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// project imports
import { NavItemType } from 'types';

export default function NavItem({ item, level }: { item: NavItemType; level: number }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const isSelected = !!matchPath({ path: item.url!, end: false }, pathname);
  const Icon = item.icon!;

  return (
    <ListItemButton
      component={Link}
      to={item.url!}
      selected={isSelected}
      sx={{ 
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
        borderRadius: `8px`,
        '&.Mui-selected': {
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.main,
          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
          },
          '& .MuiListItemIcon-root': {
            color: theme.palette.secondary.main
          }
        },
        '&:hover': {
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.main,
          '& .MuiListItemIcon-root': {
            color: theme.palette.secondary.main
          }
        }
      }}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{item.icon && <Icon size="20px" />}</ListItemIcon>
      <ListItemText
        primary={
          <Typography variant={isSelected ? 'h5' : 'body1'} color="inherit">
            {item.title}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
