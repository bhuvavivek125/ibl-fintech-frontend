// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';
import logoDark from 'assets/images/logo-dark.svg';
import logo from 'assets/images/IBL Logo.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function Logo({ dark = false }: { dark?: boolean }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={colorScheme === ThemeMode.DARK ? logoDark : logo} alt="Berry" width="100" />
     *
     */
   <img src={colorScheme === ThemeMode.DARK ? logoDark : logo} alt="IBL Fintech" width="100" />
  );
}
