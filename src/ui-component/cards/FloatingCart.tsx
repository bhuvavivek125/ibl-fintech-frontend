import { Link } from 'react-router-dom';
import { useSelector } from 'store';

import { sum } from 'lodash-es';

import { useTheme } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';

import { DefaultRootStateProps } from 'types';
import { CartProductStateProps } from 'types/cart';


export default function FloatingCart() {
  const theme = useTheme();

  const cart = useSelector((state: DefaultRootStateProps) => state.cart);
  const totalQuantity = sum(cart.checkout.products.map((item: CartProductStateProps) => item.quantity));

  return (
    <Fab
      component={Link}
      to="/apps/e-commerce/checkout"
      size="large"
      sx={{
        top: '50%',
        position: 'fixed',
        right: 0,
        zIndex: 1200,
        boxShadow: theme.vars.customShadows.warning,
        bgcolor: 'warning.dark',
        color: 'warning.light',
        borderRadius: '8px',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        '&:hover': { bgcolor: 'warning.main' }
      }}
    >
      <IconButton disableRipple aria-label="cart" sx={{ '&:hover': { bgcolor: 'transparent' } }} size="large">
        <Badge
          showZero
          badgeContent={totalQuantity}
          color="error"
          slotProps={{ badge: { sx: { right: 0, top: 3, border: '2px solid', borderColor: 'background.paper', px: 0.5 } } }}
        >
          <ShoppingCartTwoToneIcon sx={{ color: 'text.primary', ...theme.applyStyles('dark', { color: 'background.paper' }) }} />
        </Badge>
      </IconButton>
    </Fab>
  );
}
